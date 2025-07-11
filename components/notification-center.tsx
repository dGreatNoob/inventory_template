"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, AlertTriangle, CheckCircle, Info, Clock } from "lucide-react"

export function NotificationCenter() {
  const [notifications] = useState([
    {
      id: 1,
      type: "alert",
      title: "Low Stock Alert",
      message: "Desk Lamp - LED is running low (8 units remaining)",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      type: "success",
      title: "Stock-In Completed",
      message: "PO-007 stock-in process completed successfully",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "info",
      title: "New Sales Order",
      message: "Sales Order SO-012 created by customer ABC Corp",
      time: "2 hours ago",
      read: true,
    },
    {
      id: 4,
      type: "warning",
      title: "Batch Expiring Soon",
      message: "Hand Sanitizer batch HS-004-B001 expires in 30 days",
      time: "1 day ago",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          {unreadCount > 0 && <Badge variant="secondary">{unreadCount} new</Badge>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id} className="flex items-start space-x-3 p-3">
            {getIcon(notification.type)}
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-xs text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground">{notification.time}</p>
            </div>
            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center">
          <span className="text-sm text-muted-foreground">View all notifications</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
