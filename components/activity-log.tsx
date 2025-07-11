"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, User, FileText, ShoppingCart, Package, AlertTriangle, Edit } from "lucide-react"

export function ActivityLog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")

  const activities = [
    {
      id: 1,
      action: "Request Created",
      description: "New request slip #REQ-005 created for Office Supplies",
      user: "John Doe",
      timestamp: "2024-01-15 14:30:00",
      relatedEntity: "REQ-005",
      entityType: "request",
      status: "created",
    },
    {
      id: 2,
      action: "Request Approved",
      description: "Request slip #REQ-004 approved by manager",
      user: "Sarah Wilson",
      timestamp: "2024-01-15 13:45:00",
      relatedEntity: "REQ-004",
      entityType: "request",
      status: "approved",
    },
    {
      id: 3,
      action: "Purchase Order Created",
      description: "Purchase order #PO-007 created for approved request",
      user: "Mike Johnson",
      timestamp: "2024-01-15 12:20:00",
      relatedEntity: "PO-007",
      entityType: "purchase-order",
      status: "created",
    },
    {
      id: 4,
      action: "Stock-In Completed",
      description: "Stock-in process completed for PO #PO-006",
      user: "Jane Smith",
      timestamp: "2024-01-15 11:15:00",
      relatedEntity: "PO-006",
      entityType: "stock-in",
      status: "completed",
    },
    {
      id: 5,
      action: "Inventory Updated",
      description: "Stock quantity updated for Office Chair - Ergonomic",
      user: "John Doe",
      timestamp: "2024-01-15 10:30:00",
      relatedEntity: "OFC-001",
      entityType: "inventory",
      status: "updated",
    },
    {
      id: 6,
      action: "Low Stock Alert",
      description: "Low stock alert triggered for Desk Lamp - LED",
      user: "System",
      timestamp: "2024-01-15 09:45:00",
      relatedEntity: "DL-002",
      entityType: "alert",
      status: "alert",
    },
    {
      id: 7,
      action: "Request Rejected",
      description: "Request slip #REQ-003 rejected due to budget constraints",
      user: "Sarah Wilson",
      timestamp: "2024-01-15 08:20:00",
      relatedEntity: "REQ-003",
      entityType: "request",
      status: "rejected",
    },
    {
      id: 8,
      action: "Product Added",
      description: "New product 'Wireless Mouse' added to inventory",
      user: "Mike Johnson",
      timestamp: "2024-01-14 16:10:00",
      relatedEntity: "WM-008",
      entityType: "inventory",
      status: "created",
    },
    {
      id: 9,
      action: "Purchase Order Approved",
      description: "Purchase order #PO-005 approved by finance team",
      user: "Finance Team",
      timestamp: "2024-01-14 15:30:00",
      relatedEntity: "PO-005",
      entityType: "purchase-order",
      status: "approved",
    },
    {
      id: 10,
      action: "Stock Adjustment",
      description: "Manual stock adjustment for damaged items",
      user: "Jane Smith",
      timestamp: "2024-01-14 14:45:00",
      relatedEntity: "HS-004",
      entityType: "inventory",
      status: "adjusted",
    },
  ]

  const getActionIcon = (entityType: string) => {
    switch (entityType) {
      case "request":
        return <FileText className="h-4 w-4" />
      case "purchase-order":
        return <ShoppingCart className="h-4 w-4" />
      case "stock-in":
        return <Package className="h-4 w-4" />
      case "inventory":
        return <Edit className="h-4 w-4" />
      case "alert":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "created":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Created
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "updated":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Updated
          </Badge>
        )
      case "alert":
        return <Badge variant="destructive">Alert</Badge>
      case "adjusted":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Adjusted
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getEntityBadge = (entityType: string) => {
    switch (entityType) {
      case "request":
        return <Badge variant="outline">Request</Badge>
      case "purchase-order":
        return <Badge variant="outline">PO</Badge>
      case "stock-in":
        return <Badge variant="outline">Stock-In</Badge>
      case "inventory":
        return <Badge variant="outline">Inventory</Badge>
      case "alert":
        return <Badge variant="outline">Alert</Badge>
      default:
        return <Badge variant="secondary">Other</Badge>
    }
  }

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.relatedEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter === "all" || activity.entityType === actionFilter
    const matchesUser = userFilter === "all" || activity.user === userFilter
    return matchesSearch && matchesAction && matchesUser
  })

  const uniqueUsers = [...new Set(activities.map((activity) => activity.user))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Activity Log</h2>
          <p className="text-muted-foreground">Track all system activities and user actions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>System Activities</CardTitle>
              <CardDescription>Complete log of all system activities and changes</CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="request">Requests</SelectItem>
                  <SelectItem value="purchase-order">Purchase Orders</SelectItem>
                  <SelectItem value="stock-in">Stock-In</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="alert">Alerts</SelectItem>
                </SelectContent>
              </Select>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-32">
                  <User className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Related Entity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(activity.entityType)}
                      <span className="font-medium">{activity.action}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <span className="text-sm">{activity.description}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                        {activity.user.charAt(0)}
                      </div>
                      <span className="text-sm">{activity.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {activity.timestamp}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {activity.relatedEntity}
                    </Badge>
                  </TableCell>
                  <TableCell>{getEntityBadge(activity.entityType)}</TableCell>
                  <TableCell>{getStatusBadge(activity.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
