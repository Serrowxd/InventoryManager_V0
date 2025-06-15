"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { InventoryPage } from "@/components/inventory-page"
import { SettingsPage } from "@/components/settings-page"
import { ProfilePage } from "@/components/profile-page"
import { LearningPage } from "@/components/learning-page"
import { ChatbotModal } from "@/components/chatbot-modal"
import { HelpModal } from "@/components/help-modal"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("home")
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Dashboard onOpenChatbot={() => setIsChatbotOpen(true)} />
      case "inventory":
        return <InventoryPage />
      case "settings":
        return <SettingsPage />
      case "profile":
        return <ProfilePage />
      case "learning":
        return <LearningPage />
      default:
        return <Dashboard onOpenChatbot={() => setIsChatbotOpen(true)} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />
      <main className="flex-1 overflow-auto">{renderPage()}</main>

      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  )
}
