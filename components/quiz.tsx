"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight } from "lucide-react"
import questionsData from "../data/questions.json"

interface Question {
  id: number
  category: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface QuizAnswer {
  questionId: number
  selectedAnswer: number
  isCorrect: boolean
  timeSpent: number
}

interface QuizProps {
  mode: "exam" | "practice"
  onComplete: (results: QuizResults) => void
}

interface QuizResults {
  score: number
  totalQuestions: number
  percentage: number
  answers: QuizAnswer[]
  categoryBreakdown: Record<string, { correct: number; total: number }>
  timeRemaining: number
  passed: boolean
}

export default function Quiz({ mode, onComplete }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [timeRemaining, setTimeRemaining] = useState(mode === "exam" ? 1800 : 0) // 30 minutes for exam
  const [showFeedback, setShowFeedback] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({})

  // Initialize quiz with random questions
  useEffect(() => {
    const shuffled = [...questionsData].sort(() => Math.random() - 0.5)
    const selectedQuestions = shuffled.slice(0, 40)
    setQuestions(selectedQuestions)
    setQuestionStartTime(Date.now())
  }, [])

  // Timer for exam mode
  useEffect(() => {
    if (mode === "exam" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeRemaining, mode])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (value: string) => {
    const answerIndex = Number.parseInt(value)
    const currentQuestion = questions[currentQuestionIndex]

    // Record time spent on this question
    const timeSpent = Date.now() - questionStartTime
    setQuestionTimes((prev) => ({
      ...prev,
      [currentQuestion.id]: timeSpent,
    }))

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerIndex,
    }))

    if (mode === "practice") {
      setShowFeedback(true)
    }
  }

  const handleNextQuestion = () => {
    setShowFeedback(false)
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setQuestionStartTime(Date.now())
    } else {
      handleSubmitQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    setShowFeedback(false)
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
      setQuestionStartTime(Date.now())
    }
  }

  const handleSubmitQuiz = useCallback(() => {
    const quizAnswers: QuizAnswer[] = questions.map((question) => {
      const selectedAnswer = answers[question.id] ?? -1
      return {
        questionId: question.id,
        selectedAnswer,
        isCorrect: selectedAnswer === question.correct,
        timeSpent: questionTimes[question.id] || 0,
      }
    })

    const correctAnswers = quizAnswers.filter((answer) => answer.isCorrect).length
    const percentage = Math.round((correctAnswers / questions.length) * 100)

    // Calculate category breakdown
    const categoryBreakdown: Record<string, { correct: number; total: number }> = {}
    questions.forEach((question) => {
      if (!categoryBreakdown[question.category]) {
        categoryBreakdown[question.category] = { correct: 0, total: 0 }
      }
      categoryBreakdown[question.category].total++

      const answer = quizAnswers.find((a) => a.questionId === question.id)
      if (answer?.isCorrect) {
        categoryBreakdown[question.category].correct++
      }
    })

    const results: QuizResults = {
      score: correctAnswers,
      totalQuestions: questions.length,
      percentage,
      answers: quizAnswers,
      categoryBreakdown,
      timeRemaining,
      passed: percentage >= 75,
    }

    onComplete(results)
  }, [questions, answers, questionTimes, timeRemaining, onComplete])

  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Loading quiz questions...</p>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const selectedAnswer = answers[currentQuestion.id]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-xl">
            Texas Level II Security Officer {mode === "exam" ? "Exam" : "Practice"}
          </CardTitle>
          {mode === "exam" && (
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5" />
              <span className={timeRemaining < 300 ? "text-red-600" : "text-blue-600"}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span>Category: {currentQuestion.category}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>

          <RadioGroup value={selectedAnswer?.toString() || ""} onValueChange={handleAnswerSelect} className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer p-2 rounded hover:bg-gray-100">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {showFeedback && selectedAnswer !== undefined && (
          <div
            className={`p-4 rounded-lg border-l-4 ${
              selectedAnswer === currentQuestion.correct ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {selectedAnswer === currentQuestion.correct ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-semibold">
                {selectedAnswer === currentQuestion.correct ? "Correct!" : "Incorrect"}
              </span>
            </div>
            {selectedAnswer !== currentQuestion.correct && (
              <p className="text-sm mb-2">
                The correct answer is: <strong>{currentQuestion.options[currentQuestion.correct]}</strong>
              </p>
            )}
            <p className="text-sm">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestionIndex === questions.length - 1 ? (
              <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700">
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} disabled={mode === "practice" && selectedAnswer === undefined}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {mode === "exam" && (
          <div className="text-center text-sm text-gray-600">
            <p>You can navigate between questions and change your answers until time expires.</p>
            <p>Passing score: 75% (30 out of 40 questions)</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
