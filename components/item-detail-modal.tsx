"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InventoryItem {
  id: number
  name: string
  category: string
  onHand: number
  inTransit: number
  unitCost: number
  demand: "low" | "medium" | "high"
  status: "in_stock" | "low_stock" | "out_of_stock" | "suggested"
  dailySales: number[]
  estimatedDemand: number[]
}

interface ItemDetailModalProps {
  item: InventoryItem
  isOpen: boolean
  onClose: () => void
}

interface TooltipData {
  x: number
  y: number
  value: number
  date: string
  type: "sales" | "demand"
  visible: boolean
}

export function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  const [timeRange, setTimeRange] = useState<"1d" | "1w" | "1m">("1w")
  const [tooltip, setTooltip] = useState<TooltipData>({
    x: 0,
    y: 0,
    value: 0,
    date: "",
    type: "sales",
    visible: false,
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getChartData = () => {
    const salesData = item.dailySales
    const demandData = item.estimatedDemand
    const today = new Date()

    switch (timeRange) {
      case "1d":
        return {
          sales: salesData.slice(-1),
          demand: demandData.slice(0, 1),
          salesDates: [today.toLocaleDateString()],
          demandDates: [new Date(today.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()],
        }
      case "1w":
        const weekDates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
          return date.toLocaleDateString()
        })
        const futureDates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today.getTime() + (i + 1) * 24 * 60 * 60 * 1000)
          return date.toLocaleDateString()
        })
        return {
          sales: salesData.slice(-7),
          demand: demandData.slice(0, 7),
          salesDates: weekDates,
          demandDates: futureDates,
        }
      case "1m":
        const monthDates = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(today.getTime() - (29 - i) * 24 * 60 * 60 * 1000)
          return date.toLocaleDateString()
        })
        const futureMonthDates = Array.from({ length: 10 }, (_, i) => {
          const date = new Date(today.getTime() + (i + 1) * 24 * 60 * 60 * 1000)
          return date.toLocaleDateString()
        })
        return {
          sales: salesData,
          demand: demandData,
          salesDates: monthDates,
          demandDates: futureMonthDates,
        }
      default:
        return {
          sales: salesData.slice(-7),
          demand: demandData.slice(0, 7),
          salesDates: Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
            return date.toLocaleDateString()
          }),
          demandDates: Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today.getTime() + (i + 1) * 24 * 60 * 60 * 1000)
            return date.toLocaleDateString()
          }),
        }
    }
  }

  const chartData = getChartData()
  const maxValue = Math.max(...chartData.sales, ...chartData.demand)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_stock":
        return "text-green-700 bg-green-100"
      case "low_stock":
        return "text-yellow-700 bg-yellow-100"
      case "out_of_stock":
        return "text-red-700 bg-red-100"
      case "suggested":
        return "text-blue-700 bg-blue-100"
      default:
        return "text-gray-700 bg-gray-100"
    }
  }

  const getAIRecommendation = () => {
    const totalInventory = item.onHand + item.inTransit
    const avgDailySales = item.dailySales.reduce((a, b) => a + b, 0) / item.dailySales.length
    const daysOfInventory = totalInventory / avgDailySales
    const totalInvestment = totalInventory * item.unitCost

    if (item.status === "out_of_stock") {
      return `⚠️ Critical: This item is out of stock with active demand. You have ${formatCurrency(
        totalInvestment,
      )} in transit. I recommend expediting new orders immediately.`
    } else if (item.status === "low_stock" && item.demand === "high") {
      return `📈 I recommend ordering more of this item. High demand with low stock could lead to stockouts. Current investment: ${formatCurrency(
        totalInvestment,
      )}.`
    } else if (daysOfInventory > 30 && item.demand === "low") {
      return `📊 This item has excess inventory (${formatCurrency(
        totalInvestment,
      )} invested). Consider reducing future orders until stock levels normalize.`
    } else if (daysOfInventory >= 14 && daysOfInventory <= 30) {
      return `✅ This item looks healthy. Current inventory investment of ${formatCurrency(
        totalInvestment,
      )} is well-balanced with demand.`
    } else if (daysOfInventory < 7) {
      return `⏰ Stock is running low. Consider reordering soon to avoid potential stockouts. Current investment: ${formatCurrency(
        totalInvestment,
      )}.`
    } else {
      return `✅ This item looks healthy. Inventory investment of ${formatCurrency(
        totalInvestment,
      )} is appropriate for current demand patterns.`
    }
  }

  const handleMouseEnter = (
    event: React.MouseEvent,
    value: number,
    date: string,
    type: "sales" | "demand",
    x: number,
    y: number,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({
      x: x,
      y: y,
      value,
      date,
      type,
      visible: true,
    })
  }

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }))
  }

  const totalInvestment = (item.onHand + item.inTransit) * item.unitCost

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{item.onHand}</div>
                <div className="text-sm text-gray-600">In Stock</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">{item.inTransit}</div>
                <div className="text-sm text-gray-600">In Transit</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{item.onHand + item.inTransit}</div>
                <div className="text-sm text-gray-600">Total Available</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-lg font-bold text-gray-900">{formatCurrency(totalInvestment)}</div>
                <div className="text-sm text-gray-600">Total Investment</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}
                >
                  {item.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sales vs Demand Trends</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={timeRange === "1d" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange("1d")}
                  >
                    1 Day
                  </Button>
                  <Button
                    variant={timeRange === "1w" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange("1w")}
                  >
                    1 Week
                  </Button>
                  <Button
                    variant={timeRange === "1m" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange("1m")}
                  >
                    1 Month
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 relative">
                <svg width="100%" height="100%" className="overflow-visible">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Sales line (red) */}
                  <polyline
                    points={chartData.sales
                      .map((value, index) => {
                        const x = (index / (chartData.sales.length - 1)) * 600 + 40
                        const y = 200 - (value / maxValue) * 180 + 20
                        return `${x},${y}`
                      })
                      .join(" ")}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                  />

                  {/* Demand line (blue - estimated) */}
                  <polyline
                    points={chartData.demand
                      .map((value, index) => {
                        const x =
                          ((chartData.sales.length + index) / (chartData.sales.length + chartData.demand.length - 1)) *
                            600 +
                          40
                        const y = 200 - (value / maxValue) * 180 + 20
                        return `${x},${y}`
                      })
                      .join(" ")}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                  />

                  {/* Data points for sales */}
                  {chartData.sales.map((value, index) => {
                    const x = (index / (chartData.sales.length - 1)) * 600 + 40
                    const y = 200 - (value / maxValue) * 180 + 20
                    return (
                      <circle
                        key={`sales-${index}`}
                        cx={x}
                        cy={y}
                        r="6"
                        fill="#ef4444"
                        className="cursor-pointer hover:r-8 transition-all"
                        onMouseEnter={(e) => handleMouseEnter(e, value, chartData.salesDates[index], "sales", x, y)}
                        onMouseLeave={handleMouseLeave}
                      />
                    )
                  })}

                  {/* Data points for demand */}
                  {chartData.demand.map((value, index) => {
                    const x =
                      ((chartData.sales.length + index) / (chartData.sales.length + chartData.demand.length - 1)) *
                        600 +
                      40
                    const y = 200 - (value / maxValue) * 180 + 20
                    return (
                      <circle
                        key={`demand-${index}`}
                        cx={x}
                        cy={y}
                        r="6"
                        fill="#3b82f6"
                        className="cursor-pointer hover:r-8 transition-all"
                        onMouseEnter={(e) => handleMouseEnter(e, value, chartData.demandDates[index], "demand", x, y)}
                        onMouseLeave={handleMouseLeave}
                      />
                    )
                  })}
                </svg>

                {/* Tooltip */}
                {tooltip.visible && (
                  <div
                    className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-none"
                    style={{
                      left: tooltip.x + 10,
                      top: tooltip.y - 10,
                      transform: tooltip.x > 400 ? "translateX(-100%)" : "none",
                    }}
                  >
                    <div className="text-sm font-medium text-gray-900">{tooltip.date}</div>
                    <div className="text-sm text-gray-600">
                      {tooltip.type === "sales" ? "Sales" : "Estimated Demand"}: {tooltip.value} units
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-red-500"></div>
                    <span className="text-sm text-gray-600">Actual Sales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-blue-500 border-dashed border-t-2 border-blue-500"></div>
                    <span className="text-sm text-gray-600">Estimated Demand</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🤖 AI Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{getAIRecommendation()}</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
