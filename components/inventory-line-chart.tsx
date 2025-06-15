"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface InventoryLineChartProps {
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
}

export function InventoryLineChart({ selectedCategory, onCategorySelect }: InventoryLineChartProps) {
  const [data, setData] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    date: string
    type: string
    value: number
    visible: boolean
  }>({
    x: 0,
    y: 0,
    date: "",
    type: "",
    value: 0,
    visible: false,
  })

  useEffect(() => {
    setIsClient(true)
    // Load data from JSON file
    fetch("/data/inventory-data.json")
      .then((res) => res.json())
      .then((jsonData) => setData(jsonData.lineChartData))
      .catch(() => {
        // Fallback data if JSON fails to load
        setData([
          { date: "Jan 1", inStock: 1200, inTransit: 300, outOfStock: 50, suggested: 200 },
          { date: "Jan 8", inStock: 1150, inTransit: 320, outOfStock: 45, suggested: 210 },
          { date: "Jan 15", inStock: 1180, inTransit: 280, outOfStock: 60, suggested: 190 },
          { date: "Jan 22", inStock: 1230, inTransit: 340, outOfStock: 63, suggested: 215 },
        ])
      })
  }, [])

  if (!isClient) {
    return (
      <div className="h-80 w-full flex items-center justify-center">
        <div className="text-gray-500">Loading chart...</div>
      </div>
    )
  }

  const colors = {
    inStock: "#10b981",
    inTransit: "#f59e0b",
    outOfStock: "#ef4444",
    suggested: "#3b82f6",
  }

  const maxValue = Math.max(...data.flatMap((item) => [item.inStock, item.inTransit, item.outOfStock, item.suggested]))
  const minValue = Math.min(...data.flatMap((item) => [item.inStock, item.inTransit, item.outOfStock, item.suggested]))

  const getLineOpacity = (dataKey: string) => {
    if (!selectedCategory) return 1
    return selectedCategory === dataKey ? 1 : 0.3
  }

  const handleLineClick = (dataKey: string) => {
    onCategorySelect(selectedCategory === dataKey ? null : dataKey)
  }

  const getYPosition = (value: number) => {
    return ((maxValue - value) / (maxValue - minValue)) * 240 + 20
  }

  const handleMouseEnter = (
    event: React.MouseEvent,
    date: string,
    type: string,
    value: number,
    x: number,
    y: number,
  ) => {
    const containerRect = event.currentTarget.closest(".h-80")?.getBoundingClientRect()
    if (containerRect) {
      setTooltip({
        x: x,
        y: y,
        date,
        type,
        value,
        visible: true,
      })
    }
  }

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }))
  }

  const getTypeLabel = (key: string) => {
    switch (key) {
      case "inStock":
        return "In Stock"
      case "inTransit":
        return "In Transit"
      case "outOfStock":
        return "Out of Stock"
      case "suggested":
        return "Suggested"
      default:
        return key
    }
  }

  return (
    <div className="h-80 w-full p-4 relative">
      <svg width="100%" height="280" className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="240" fill="url(#grid)" />

        {/* Lines */}
        {Object.entries(colors).map(([key, color]) => {
          const points = data
            .map((item, index) => {
              const x = (index / (data.length - 1)) * 600 + 40
              const y = getYPosition(item[key as keyof typeof item])
              return `${x},${y}`
            })
            .join(" ")

          return (
            <g key={key}>
              <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="3"
                opacity={getLineOpacity(key)}
                className="cursor-pointer transition-opacity duration-200"
                onClick={() => handleLineClick(key)}
              />
              {/* Data points */}
              {data.map((item, index) => {
                const x = (index / (data.length - 1)) * 600 + 40
                const y = getYPosition(item[key as keyof typeof item])
                return (
                  <circle
                    key={`${key}-${index}`}
                    cx={x}
                    cy={y}
                    r="6"
                    fill={color}
                    opacity={getLineOpacity(key)}
                    className="cursor-pointer transition-all duration-200 hover:r-8"
                    onClick={() => handleLineClick(key)}
                    onMouseEnter={(e) =>
                      handleMouseEnter(e, item.date, getTypeLabel(key), item[key as keyof typeof item], x, y)
                    }
                    onMouseLeave={handleMouseLeave}
                  />
                )
              })}
            </g>
          )
        })}

        {/* X-axis labels */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 600 + 40
          return (
            <text key={index} x={x} y="270" textAnchor="middle" className="text-xs fill-gray-600">
              {item.date}
            </text>
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
            {tooltip.type}: {tooltip.value} items
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center space-x-4 mt-4">
        {Object.entries(colors).map(([key, color]) => (
          <div key={key} className="flex items-center space-x-1 cursor-pointer" onClick={() => handleLineClick(key)}>
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: color,
                opacity: getLineOpacity(key),
              }}
            />
            <span className="text-xs capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
