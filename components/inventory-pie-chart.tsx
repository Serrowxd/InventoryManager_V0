"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface InventoryPieChartProps {
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
}

export function InventoryPieChart({ selectedCategory, onCategorySelect }: InventoryPieChartProps) {
  const [data, setData] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    name: string
    value: number
    percentage: number
    visible: boolean
  }>({
    x: 0,
    y: 0,
    name: "",
    value: 0,
    percentage: 0,
    visible: false,
  })

  useEffect(() => {
    setIsClient(true)
    // Load data from JSON file
    fetch("/data/inventory-data.json")
      .then((res) => res.json())
      .then((jsonData) => setData(jsonData.pieChartData))
      .catch(() => {
        // Fallback data if JSON fails to load
        setData([
          { name: "In Stock", value: 2230, color: "#10b981" },
          { name: "In Transit", value: 570, color: "#f59e0b" },
          { name: "Out of Stock", value: 113, color: "#ef4444" },
          { name: "Suggested", value: 367, color: "#3b82f6" },
        ])
      })
  }, [])

  if (!isClient) {
    return (
      <div className="h-80 w-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  const getSliceOpacity = (name: string) => {
    if (!selectedCategory) return 1
    const mappedKey =
      name === "In Stock"
        ? "inStock"
        : name === "In Transit"
          ? "inTransit"
          : name === "Out of Stock"
            ? "outOfStock"
            : "suggested"
    return selectedCategory === mappedKey ? 1 : 0.3
  }

  const handleSliceClick = (name: string) => {
    const mappedKey =
      name === "In Stock"
        ? "inStock"
        : name === "In Transit"
          ? "inTransit"
          : name === "Out of Stock"
            ? "outOfStock"
            : "suggested"

    onCategorySelect(selectedCategory === mappedKey ? null : mappedKey)
  }

  const handleMouseEnter = (event: React.MouseEvent, name: string, value: number, percentage: number) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const containerRect = event.currentTarget.closest(".h-80")?.getBoundingClientRect()
    if (containerRect) {
      setTooltip({
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top,
        name,
        value,
        percentage,
        visible: true,
      })
    }
  }

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }))
  }

  return (
    <div className="h-80 w-full flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg width="192" height="192" className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = item.value / total
            const angle = percentage * 360
            const startAngle = currentAngle
            const endAngle = currentAngle + angle

            // Calculate path for pie slice
            const startAngleRad = (startAngle * Math.PI) / 180
            const endAngleRad = (endAngle * Math.PI) / 180
            const largeArcFlag = angle > 180 ? 1 : 0

            const x1 = 96 + 80 * Math.cos(startAngleRad)
            const y1 = 96 + 80 * Math.sin(startAngleRad)
            const x2 = 96 + 80 * Math.cos(endAngleRad)
            const y2 = 96 + 80 * Math.sin(endAngleRad)

            const pathData = [`M 96 96`, `L ${x1} ${y1}`, `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`, "Z"].join(" ")

            currentAngle += angle

            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                opacity={getSliceOpacity(item.name)}
                className="cursor-pointer transition-opacity duration-200 hover:opacity-80"
                onClick={() => handleSliceClick(item.name)}
                onMouseEnter={(e) => handleMouseEnter(e, item.name, item.value, (item.value / total) * 100)}
                onMouseLeave={handleMouseLeave}
              />
            )
          })}
        </svg>
        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="absolute z-10 bg-popover border border-border rounded-lg shadow-lg p-3 pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="text-sm font-medium text-popover-foreground">{tooltip.name}</div>
            <div className="text-sm text-muted-foreground">
              {tooltip.value} items ({tooltip.percentage.toFixed(1)}%)
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80"
            onClick={() => handleSliceClick(item.name)}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: item.color,
                opacity: getSliceOpacity(item.name),
              }}
            />
            <span className="text-sm text-muted-foreground">
              {item.name} ({item.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
