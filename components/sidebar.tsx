"use client"

import { Home, Package, Settings, User, GraduationCap, Bot, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  onOpenChatbot: () => void
  onOpenHelp: () => void
}

export function Sidebar({ currentPage, onNavigate, onOpenChatbot, onOpenHelp }: SidebarProps) {
  const navigationItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "inventory", icon: Package, label: "Inventory" },
    { id: "chatbot", icon: Bot, label: "AI Assistant", action: onOpenChatbot },
    { id: "learning", icon: GraduationCap, label: "Learning" },
    { id: "profile", icon: User, label: "Profile" },
  ]

  const bottomItems = [
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "help", icon: HelpCircle, label: "Help", action: onOpenHelp },
  ]

  const handleItemClick = (item: any) => {
    if (item.action) {
      item.action()
    } else {
      onNavigate(item.id)
    }
  }

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 shadow-sm">
      <div className="mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
      </div>

      <nav className="flex flex-col space-y-2 flex-1">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            className={cn(
              "w-12 h-12 rounded-xl transition-all duration-200",
              currentPage === item.id
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            )}
            onClick={() => handleItemClick(item)}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </Button>
        ))}
      </nav>

      <div className="flex flex-col space-y-2 mt-auto">
        {bottomItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            className={cn(
              "w-12 h-12 rounded-xl transition-all duration-200",
              currentPage === item.id
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            )}
            onClick={() => handleItemClick(item)}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </Button>
        ))}
      </div>
    </div>
  )
}
