"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DollarSign, FileText, AlertTriangle, TrendingUp, Truck, CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"

export function Dashboard() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })

  const kpis = [
    {
      title: "Total Stock Value",
      value: "$324,750",
      change: "+15.2%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Pending Requests",
      value: "18",
      change: "+3 today",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Active Sales Orders",
      value: "42",
      change: "8 shipped today",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Low Stock Alerts",
      value: "12",
      change: "3 critical",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Pending Shipments",
      value: "15",
      change: "5 due today",
      icon: Truck,
      color: "text-orange-600",
    },
    {
      title: "Outstanding Receivables",
      value: "$89,450",
      change: "12 overdue",
      icon: DollarSign,
      color: "text-red-600",
    },
  ]

  const recentActivity = [
    { id: 1, action: "Sales Order SO-015 created", user: "Sarah Wilson", time: "10 min ago", type: "sales" },
    { id: 2, action: "Batch HS-004-B003 expires in 15 days", user: "System", time: "30 min ago", type: "alert" },
    { id: 3, action: "Shipment SH-008 delivered", user: "Mike Johnson", time: "1 hour ago", type: "shipping" },
    { id: 4, action: "Payment received for SO-012", user: "Finance Team", time: "2 hours ago", type: "finance" },
    { id: 5, action: "Stock-in completed for PO #PO-047", user: "Jane Smith", time: "3 hours ago", type: "inventory" },
  ]

  const batchExpirations = [
    { product: "Hand Sanitizer", batch: "HS-004-B003", expiry: "2024-02-15", days: 15, status: "warning" },
    { product: "Face Masks", batch: "FM-005-B001", expiry: "2024-02-28", days: 28, status: "normal" },
    { product: "Disinfectant", batch: "DS-006-B002", expiry: "2024-03-10", days: 38, status: "normal" },
    { product: "Gloves", batch: "GL-007-B001", expiry: "2024-01-25", days: 5, status: "critical" },
  ]

  const salesMetrics = [
    { period: "Today", orders: 8, revenue: "$12,450" },
    { period: "This Week", orders: 34, revenue: "$67,890" },
    { period: "This Month", orders: 142, revenue: "$289,340" },
  ]

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "sales":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Sales
          </Badge>
        )
      case "shipping":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Shipping
          </Badge>
        )
      case "finance":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Finance
          </Badge>
        )
      case "inventory":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Inventory
          </Badge>
        )
      case "alert":
        return <Badge variant="destructive">Alert</Badge>
      default:
        return <Badge variant="secondary">System</Badge>
    }
  }

  const getExpiryStatus = (days: number) => {
    if (days <= 7) return "critical"
    if (days <= 30) return "warning"
    return "normal"
  }

  const getExpiryBadge = (status: string, days: number) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">{days} days</Badge>
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            {days} days
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {days} days
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Date Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your business operations</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <CalendarIcon className="h-4 w-4" />
              {dateRange.from && dateRange.to
                ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`
                : "Select date range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => range && setDateRange(range)}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">by {activity.user}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {getActivityBadge(activity.type)}
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Batch Expirations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Batch Expirations
            </CardTitle>
            <CardDescription>Products expiring soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {batchExpirations.map((batch, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{batch.product}</p>
                    <p className="text-xs text-muted-foreground">Batch: {batch.batch}</p>
                    <p className="text-xs text-muted-foreground">Expires: {batch.expiry}</p>
                  </div>
                  {getExpiryBadge(batch.status, batch.days)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sales Performance
            </CardTitle>
            <CardDescription>Sales orders and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{metric.period}</p>
                    <p className="text-xs text-muted-foreground">{metric.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{metric.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
