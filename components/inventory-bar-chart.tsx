"use client"

import { useState, useEffect } from "react"

interface InventoryBarChartProps {
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
}

export function InventoryBarChart({ selectedCategory, onCategorySelect }: InventoryBarChartProps) {
  const [data, setData] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)

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

  return (
    <div className="h-80 w-full">
      {/* Chart Area */}
      <div className="h-64 flex items-end justify-between px-4 py-4 bg-gray-50 rounded-lg mb-4">
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
