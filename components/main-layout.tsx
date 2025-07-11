"use client"

import { ReactNode } from "react"
import { UserProfile } from "@/components/user-profile"
import { NotificationCenter } from "@/components/notification-center"
import { ModeToggle } from "@/components/mode-toggle"
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Package,
  ShoppingCart,
  Truck,
  DollarSign,
  Activity,
  Box,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface MainLayoutProps {
  children: ReactNode
  currentPage?: string
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Requests", href: "/requests", icon: ClipboardList },
  { name: "POs", href: "/purchase-orders", icon: FileText },
  { name: "Stock-In", href: "/stock-in", icon: Box },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Sales", href: "/sales", icon: ShoppingCart },
  { name: "Shipping", href: "/shipping", icon: Truck },
  { name: "Finance", href: "/finance", icon: DollarSign },
  { name: "Activity", href: "/activity", icon: Activity },
]

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const active = navigation.find(
    (item) =>
      (item.href === "/" && pathname === "/") ||
      (item.href !== "/" && pathname.startsWith(item.href))
  )?.name

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background flex items-center justify-between h-16 px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Package className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold tracking-tight">gentle walker</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <ModeToggle />
          <UserProfile />
        </div>
      </header>
      {/* Navigation Bar */}
      <nav className="w-full border-b border-border bg-background flex justify-center h-14 items-center">
        <div className="flex gap-1 sm:gap-2">
          {navigation.map((item) => {
            const isActive = active === item.name
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }
                `}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      {/* Page Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  )
} 