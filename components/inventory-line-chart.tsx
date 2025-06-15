"use client"

import { useState, useEffect } from "react"

interface InventoryLineChartProps {
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
}

export function InventoryLineChart({ selectedCategory, onCategorySelect }: InventoryLineChartProps) {
  const [data, setData] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)

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

  return (
    <div className="h-80 w-full p-4">
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
                    r="4"
                    fill={color}
                    opacity={getLineOpacity(key)}
                    className="cursor-pointer transition-opacity duration-200"
                    onClick={() => handleLineClick(key)}
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
