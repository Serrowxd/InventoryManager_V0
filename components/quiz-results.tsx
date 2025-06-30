"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { XCircle, Download, RotateCcw, Award, Clock } from "lucide-react"
import questionsData from "../data/questions.json"

interface QuizAnswer {
  questionId: number
  selectedAnswer: number
  isCorrect: boolean
  timeSpent: number
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

interface QuizResultsProps {
  results: QuizResults
  mode: "exam" | "practice"
  onRetake: () => void
  onNewQuiz: () => void
}

export default function QuizResults({ results, mode, onRetake, onNewQuiz }: QuizResultsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const generateCertificate = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 600

    // Background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Border
    ctx.strokeStyle = "#2563eb"
    ctx.lineWidth = 8
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

    // Title
    ctx.fillStyle = "#1e40af"
    ctx.font = "bold 36px Arial"
    ctx.textAlign = "center"
    ctx.fillText("CERTIFICATE OF COMPLETION", canvas.width / 2, 120)

    // Subtitle
    ctx.font = "24px Arial"
    ctx.fillText("Texas Level II Security Officer Practice Quiz", canvas.width / 2, 160)

    // Score
    ctx.font = "bold 48px Arial"
    ctx.fillStyle = results.passed ? "#16a34a" : "#dc2626"
    ctx.fillText(`${results.percentage}%`, canvas.width / 2, 240)

    // Details
    ctx.fillStyle = "#374151"
    ctx.font = "20px Arial"
    ctx.fillText(`Score: ${results.score} out of ${results.totalQuestions}`, canvas.width / 2, 280)
    ctx.fillText(`Status: ${results.passed ? "PASSED" : "NEEDS IMPROVEMENT"}`, canvas.width / 2, 310)

    // Date
    ctx.font = "16px Arial"
    ctx.fillText(`Completed on: ${new Date().toLocaleDateString()}`, canvas.width / 2, 380)

    // Footer
    ctx.font = "14px Arial"
    ctx.fillStyle = "#6b7280"
    ctx.fillText("This certificate is for practice purposes only", canvas.width / 2, 520)
    ctx.fillText("and does not constitute official certification", canvas.width / 2, 540)

    // Download
    const link = document.createElement("a")
    link.download = `texas-security-quiz-certificate-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const getIncorrectAnswers = () => {
    return results.answers
      .filter((answer) => !answer.isCorrect)
      .map((answer) => {
        const question = questionsData.find((q) => q.id === answer.questionId)
        return { answer, question }
      })
      .filter((item) => item.question)
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Main Results Card */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {results.passed ? (
              <Award className="h-16 w-16 text-green-600" />
            ) : (
              <XCircle className="h-16 w-16 text-red-600" />
            )}
          </div>
          <CardTitle className="text-3xl">{results.passed ? "Congratulations!" : "Keep Studying!"}</CardTitle>
          <p className="text-xl text-gray-600">
            You scored {results.score} out of {results.totalQuestions} ({results.percentage}%)
          </p>
          <Badge variant={results.passed ? "default" : "destructive"} className="text-lg px-4 py-2 mt-2">
            {results.passed ? "PASSED" : "NEEDS IMPROVEMENT"}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Score</span>
              <span>{results.percentage}%</span>
            </div>
            <Progress value={results.percentage} className={`h-3 ${results.passed ? "bg-green-100" : "bg-red-100"}`} />
            <p className="text-sm text-gray-600 text-center">Passing score: 75% (30 out of 40 questions)</p>
          </div>

          {/* Time Information */}
          {mode === "exam" && (
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Time remaining: {formatTime(results.timeRemaining)}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={onRetake} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
            <Button onClick={onNewQuiz}>New Quiz</Button>
            {results.passed && (
              <Button onClick={generateCertificate} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(results.categoryBreakdown).map(([category, stats]) => {
              const percentage = Math.round((stats.correct / stats.total) * 100)
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category}</span>
                    <span>
                      {stats.correct}/{stats.total} ({percentage}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Study Guide for Incorrect Answers */}
      {getIncorrectAnswers().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Study Guide - Review These Questions
            </CardTitle>
            <p className="text-gray-600">Review the questions you missed to improve your knowledge</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {getIncorrectAnswers().map(({ answer, question }, index) => (
              <div key={answer.questionId} className="border-l-4 border-red-500 pl-4 space-y-2">
                <h4 className="font-medium">
                  Question {index + 1}: {question!.question}
                </h4>
                <div className="text-sm space-y-1">
                  <p className="text-red-600">
                    Your answer: {question!.options[answer.selectedAnswer] || "No answer selected"}
                  </p>
                  <p className="text-green-600">Correct answer: {question!.options[question!.correct]}</p>
                  <p className="text-gray-600">
                    <strong>Explanation:</strong> {question!.explanation}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {question!.category}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Texas Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Study Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">Texas Department of Public Safety</h4>
              <p className="text-sm text-gray-600">
                Official regulations and licensing information for security officers
              </p>
              <a
                href="https://www.dps.texas.gov/section/regulatory-services-division"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Visit DPS Regulatory Services →
              </a>
            </div>
            <div>
              <h4 className="font-medium">Texas Occupations Code Chapter 1702</h4>
              <p className="text-sm text-gray-600">Complete text of the Private Security Act</p>
              <a
                href="https://statutes.capitol.texas.gov/Docs/OC/htm/OC.1702.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Read the Full Code →
              </a>
            </div>
            <div>
              <h4 className="font-medium">Security Officer Training Requirements</h4>
              <p className="text-sm text-gray-600">
                Information about required training hours and continuing education
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
