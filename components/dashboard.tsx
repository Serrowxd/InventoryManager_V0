"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Info } from "lucide-react"
import { InventoryBarChart } from "@/components/inventory-bar-chart"
import { InventoryPieChart } from "@/components/inventory-pie-chart"
import { InventoryLineChart } from "@/components/inventory-line-chart"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DashboardProps {
  onOpenChatbot: () => void
}

export function Dashboard({ onOpenChatbot }: DashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalItems: 4247,
    lowStockItems: 31,
    inTransit: 287,
    totalValue: 142850,
    dailySales: 847,
    monthlySales: 25410,
  })

  useEffect(() => {
    // Load stats from JSON file
    fetch("/data/inventory-data.json")
      .then((res) => res.json())
      .then((data) => setStats(data.stats))
      .catch(() => {
        // Keep fallback stats if JSON fails to load
        console.log("Using fallback stats data")
      })
  }, [])

  const statsDisplay = [
    {
      title: "Total Items",
      value: stats.totalItems.toLocaleString(),
      change: "+15%",
      positive: true,
      info: "Total number of items currently in inventory across all categories",
    },
    {
      title: "Daily Sales",
      value: stats.dailySales.toLocaleString(),
      change: "+8%",
      positive: true,
      info: "Number of items sold today across all categories",
    },
    {
      title: "Monthly Sales",
      value: stats.monthlySales.toLocaleString(),
      change: "+22%",
      positive: true,
      info: "Total number of items sold this month across all categories",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems.toString(),
      change: "-5%",
      positive: true,
      info: "Items that are below the minimum stock threshold and need reordering",
    },
    {
      title: "In Transit",
      value: stats.inTransit.toString(),
      change: "+28%",
      positive: true,
      info: "Items currently being shipped or in the process of delivery",
    },
    {
      title: "Value",
      value: `$${stats.totalValue.toLocaleString()}`,
      change: "+19%",
      positive: true,
      info: "Total monetary value of all inventory items at current market prices",
    },
  ]

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Inventory Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor and manage your inventory in real-time</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statsDisplay.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  {stat.title}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{stat.info}</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className={`text-xs ${stat.positive ? "text-green-600" : "text-red-600"} mt-1`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Assistant Section */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hello! Need help with your inventory?</h3>
                <p className="text-gray-600">
                  Ask our AI assistant about stock levels, trends, or get recommendations for your inventory management.
                </p>
              </div>
              <Button
                onClick={onOpenChatbot}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                Open AI Assistant
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Inventory Levels by Category
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Green: In stock, Yellow: In transit, Red: Out of stock, Blue: Suggested reorder</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryBarChart selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Stock Distribution
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Overall distribution of inventory across different status categories</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryPieChart selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Inventory Trends (Last 7 Weeks)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Track inventory changes over time to identify patterns and trends</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryLineChart selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
