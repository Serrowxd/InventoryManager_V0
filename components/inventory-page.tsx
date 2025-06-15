"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ItemDetailModal } from "@/components/item-detail-modal"

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

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Load inventory items from JSON
    fetch("/data/inventory-items.json")
      .then((res) => res.json())
      .then((data) => setItems(data.items))
      .catch(() => {
        console.log("Failed to load inventory data")
      })
  }, [])

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "high":
        return "text-green-600 bg-green-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const handleItemSelect = (itemId: number) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item.id))
    }
  }

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your complete inventory with detailed insights</p>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Items ({items.length})</span>
              <span className="text-sm font-normal text-gray-500">{selectedItems.length} selected</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <Checkbox
                        checked={selectedItems.length === items.length && items.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Item</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Current</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Investment</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Demand</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const totalInvestment = (item.onHand + item.inTransit) * item.unitCost
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleItemClick(item)}
                      >
                        <td className="py-3 px-4">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => handleItemSelect(item.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-600">{item.category}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{item.onHand + item.inTransit}</div>
                          <div className="text-xs text-gray-500">
                            {item.onHand} on hand + {item.inTransit} transit
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{formatCurrency(totalInvestment)}</div>
                          <div className="text-xs text-gray-500">{formatCurrency(item.unitCost)} per unit</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getDemandColor(
                              item.demand,
                            )}`}
                          >
                            {item.demand}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {selectedItem && (
          <ItemDetailModal item={selectedItem} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const getStatusStyle = (status: string) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "in_stock":
        return "In Stock"
      case "low_stock":
        return "Low Stock"
      case "out_of_stock":
        return "Out of Stock"
      case "suggested":
        return "Suggested"
      default:
        return "Unknown"
    }
  }

  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(status)}`}>
      {getStatusText(status)}
    </span>
  )
}
