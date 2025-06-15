"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface InventoryBarChartProps {
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
}

export function InventoryBarChart({ selectedCategory, onCategorySelect }: InventoryBarChartProps) {
  const [data, setData] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    category: string
    type: string
    value: number
    visible: boolean
  }>({
    x: 0,
    y: 0,
    category: "",
    type: "",
    value: 0,
    visible: false,
  })

  useEffect(() => {
    setIsClient(true)
    // Load data from JSON file
    fetch("/data/inventory-data.json")
      .then((res) => res.json())
      .then((jsonData) => setData(jsonData.barChartData))
      .catch(() => {
        // Fallback data if JSON fails to load
        setData([
          { category: "Electronics", inStock: 450, inTransit: 120, outOfStock: 25, suggested: 80 },
          { category: "Clothing", inStock: 320, inTransit: 85, outOfStock: 12, suggested: 45 },
          { category: "Home & Garden", inStock: 280, inTransit: 95, outOfStock: 18, suggested: 60 },
          { category: "Sports", inStock: 180, inTransit: 40, outOfStock: 8, suggested: 30 },
        ])
      })
  }, [])

  if (!isClient || data.length === 0) {
    return (
      <div className="h-80 w-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-gray-500">Loading inventory data...</div>
      </div>
    )
  }

  const colors = {
    inStock: "#10b981",
    inTransit: "#f59e0b",
    outOfStock: "#ef4444",
    suggested: "#3b82f6",
  }

  const labels = {
    inStock: "In Stock",
    inTransit: "In Transit",
    outOfStock: "Out of Stock",
    suggested: "Suggested",
  }

  // Find the maximum total for scaling
  const maxTotal = Math.max(...data.map((item) => item.inStock + item.inTransit + item.outOfStock + item.suggested))

  const getOpacity = (category: string) => {
    if (!selectedCategory) return 1
    return selectedCategory === category ? 1 : 0.3
  }

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      onCategorySelect(null)
    } else {
      onCategorySelect(category)
    }
  }

  const handleMouseEnter = (event: React.MouseEvent, category: string, type: string, value: number) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const containerRect = event.currentTarget.closest(".h-80")?.getBoundingClientRect()
    if (containerRect) {
      // Position tooltip to the right of the specific bar
      const tooltipX = rect.left - containerRect.left + rect.width + 12 // 12px offset from bar
      const tooltipY = rect.top - containerRect.top + rect.height / 2

      setTooltip({
        x: tooltipX,
        y: tooltipY,
        category,
        type,
        value,
        visible: true,
      })
    }
  }

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }))
  }

  return (
    <div className="h-80 w-full">
      {/* Chart Area */}
      <div className="h-64 flex items-end justify-between px-4 py-4 bg-gray-50 rounded-lg mb-4 relative">
        {data.map((item, index) => {
          const total = item.inStock + item.inTransit + item.outOfStock + item.suggested
          const maxHeight = 200 // pixels

          return (
            <div key={index} className="flex flex-col items-center flex-1 mx-1">
              {/* Bar Container */}
              <div className="relative w-full max-w-16 h-48 flex flex-col justify-end">
                {/* In Stock */}
                <div
                  className="w-full transition-all duration-200 cursor-pointer hover:brightness-110"
                  style={{
                    backgroundColor: colors.inStock,
                    height: `${(item.inStock / maxTotal) * maxHeight}px`,
                    opacity: getOpacity("inStock"),
                  }}
                  onClick={() => handleCategoryClick("inStock")}
                  onMouseEnter={(e) => handleMouseEnter(e, item.category, "In Stock", item.inStock)}
                  onMouseLeave={handleMouseLeave}
                  title={`${labels.inStock}: ${item.inStock}`}
                />

                {/* In Transit */}
                <div
                  className="w-full transition-all duration-200 cursor-pointer hover:brightness-110"
                  style={{
                    backgroundColor: colors.inTransit,
                    height: `${(item.inTransit / maxTotal) * maxHeight}px`,
                    opacity: getOpacity("inTransit"),
                  }}
                  onClick={() => handleCategoryClick("inTransit")}
                  onMouseEnter={(e) => handleMouseEnter(e, item.category, "In Transit", item.inTransit)}
                  onMouseLeave={handleMouseLeave}
                  title={`${labels.inTransit}: ${item.inTransit}`}
                />

                {/* Out of Stock */}
                <div
                  className="w-full transition-all duration-200 cursor-pointer hover:brightness-110"
                  style={{
                    backgroundColor: colors.outOfStock,
                    height: `${(item.outOfStock / maxTotal) * maxHeight}px`,
                    opacity: getOpacity("outOfStock"),
                  }}
                  onClick={() => handleCategoryClick("outOfStock")}
                  onMouseEnter={(e) => handleMouseEnter(e, item.category, "Out of Stock", item.outOfStock)}
                  onMouseLeave={handleMouseLeave}
                  title={`${labels.outOfStock}: ${item.outOfStock}`}
                />

                {/* Suggested */}
                <div
                  className="w-full transition-all duration-200 cursor-pointer hover:brightness-110"
                  style={{
                    backgroundColor: colors.suggested,
                    height: `${(item.suggested / maxTotal) * maxHeight}px`,
                    opacity: getOpacity("suggested"),
                  }}
                  onClick={() => handleCategoryClick("suggested")}
                  onMouseEnter={(e) => handleMouseEnter(e, item.category, "Suggested", item.suggested)}
                  onMouseLeave={handleMouseLeave}
                  title={`${labels.suggested}: ${item.suggested}`}
                />
              </div>

              {/* Category Label */}
              <div className="mt-2 text-xs text-gray-600 text-center font-medium">{item.category}</div>

              {/* Total Count */}
              <div className="text-xs text-gray-500">{total}</div>
            </div>
          )
        })}

        {/* Tooltip positioned next to the specific bar */}
        {tooltip.visible && (
          <div
            className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-none min-w-[140px]"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translateY(-50%)",
            }}
          >
            <div className="text-sm font-medium text-gray-900">{tooltip.category}</div>
            <div className="text-sm text-gray-600">
              {tooltip.type}: {tooltip.value} items
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4">
        {Object.entries(colors).map(([key, color]) => (
          <div
            key={key}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleCategoryClick(key)}
          >
            <div
              className="w-3 h-3 rounded"
              style={{
                backgroundColor: color,
                opacity: getOpacity(key),
              }}
            />
            <span className="text-sm text-gray-600">{labels[key as keyof typeof labels]}</span>
          </div>
        ))}
      </div>

      {/* Selected Category Info */}
      {selectedCategory && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-900">
            Filtered by: {labels[selectedCategory as keyof typeof labels]}
          </div>
          <div className="text-xs text-blue-700 mt-1">Click the same category again to clear the filter</div>
        </div>
      )}
    </div>
  )
}
