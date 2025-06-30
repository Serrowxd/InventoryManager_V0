"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, Award, BookOpen, CheckCircle } from "lucide-react"
import Quiz from "../components/quiz"
import QuizResultsComponent from "../components/quiz-results"

type AppState = "home" | "exam" | "practice" | "results"

export default function Home() {
  const [appState, setAppState] = useState<AppState>("home")
  const [quizMode, setQuizMode] = useState<"exam" | "practice">("exam")
  const [quizResults, setQuizResults] = useState<any | null>(null)

  const handleStartExam = () => {
    setQuizMode("exam")
    setAppState("exam")
  }

  const handleStartPractice = () => {
    setQuizMode("practice")
    setAppState("practice")
  }

  const handleQuizComplete = (results: any) => {
    setQuizResults(results)
    setAppState("results")
  }

  const handleRetake = () => {
    setAppState(quizMode)
  }

  const handleNewQuiz = () => {
    setAppState("home")
    setQuizResults(null)
  }

  if (appState === "exam" || appState === "practice") {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <Quiz mode={quizMode} onComplete={handleQuizComplete} />
      </div>
    )
  }

  if (appState === "results" && quizResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <QuizResultsComponent results={quizResults} mode={quizMode} onRetake={handleRetake} onNewQuiz={handleNewQuiz} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Texas Level II Security Officer Quiz</h1>
          <p className="text-xl text-blue-100">
            Prepare for your Noncommissioned Security Officer (Unarmed) certification exam
          </p>
          <Badge variant="secondary" className="mt-4 text-lg px-4 py-2">
            Texas Department of Public Safety Approved Content
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Quiz Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Exam Mode */}
          <Card className="border-2 hover:border-blue-500 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-8 w-8 text-blue-600" />
                <CardTitle className="text-2xl">Exam Mode</CardTitle>
              </div>
              <p className="text-gray-600">Simulate the real Texas Level II exam conditions</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">40 random questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">30-minute time limit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">75% passing score required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Certificate for passing scores</span>
                </div>
              </div>
              <Button onClick={handleStartExam} className="w-full" size="lg">
                Start Exam
              </Button>
            </CardContent>
          </Card>

          {/* Practice Mode */}
          <Card className="border-2 hover:border-green-500 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-8 w-8 text-green-600" />
                <CardTitle className="text-2xl">Practice Mode</CardTitle>
              </div>
              <p className="text-gray-600">Learn with immediate feedback and explanations</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">40 random questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">No time limit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Immediate feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Detailed explanations</span>
                </div>
              </div>
              <Button onClick={handleStartPractice} className="w-full bg-transparent" size="lg" variant="outline">
                Start Practice
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Information Sections */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Exam Coverage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Exam Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Roles and Responsibilities</li>
                <li>• Texas Laws and Regulations</li>
                <li>• Security Communications</li>
                <li>• Emergency Response</li>
                <li>• Ethical Standards</li>
              </ul>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Certification Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Pass with 75% or higher</li>
                <li>• Complete within 30 minutes</li>
                <li>• Answer 30 of 40 questions correctly</li>
                <li>• Understand Texas Occupations Code</li>
              </ul>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• 100+ unique questions</li>
                <li>• Detailed explanations</li>
                <li>• Category performance tracking</li>
                <li>• Downloadable certificates</li>
                <li>• Mobile-friendly design</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="mt-12 bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Important Disclaimer</h3>
            <p className="text-sm text-gray-700">
              This quiz is designed for practice and study purposes only. While the content is based on Texas Department
              of Public Safety requirements and regulations, it does not constitute official certification or guarantee
              success on the actual Level II exam. Always refer to official DPS materials and approved training programs
              for the most current requirements.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
