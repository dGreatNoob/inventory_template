"use client"

import { ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { UserProfile } from "@/components/user-profile"
import { NotificationCenter } from "@/components/notification-center"
import { ModeToggle } from "@/components/mode-toggle"
import gentleLogoDark from "@/app/images/gentle_dark.png"
import gentleLogoWhite from "@/app/images/gentle_white.png"
import Image from "next/image"
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  ShoppingCart,
  Truck,
  DollarSign,
  Activity,
  Box,
  Boxes,
  TrendingUp,
  Package,
} from "lucide-react"
import { useTheme } from "next-themes"

interface MainLayoutProps {
  children: ReactNode
}

const navTabs = [
  { name: "Dashboard", value: "dashboard", href: "/", icon: LayoutDashboard },
  { name: "Requests", value: "requests", href: "/requests", icon: FileText },
  { name: "POs", value: "purchase-orders", href: "/purchase-orders", icon: ShoppingCart },
  { name: "Stock-In", value: "stock-in", href: "/stock-in", icon: Package },
  { name: "Inventory", value: "inventory", href: "/inventory", icon: Boxes },
  { name: "Sales", value: "sales", href: "/sales", icon: TrendingUp },
  { name: "Shipping", value: "shipping", href: "/shipping", icon: Truck },
  { name: "Finance", value: "finance", href: "/finance", icon: DollarSign },
  { name: "Activity", value: "activity", href: "/activity", icon: Activity },
]

export function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { resolvedTheme } = useTheme();

  // Determine active tab by current route
  const activeTab = navTabs.find(tab => tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href))?.value || "dashboard"

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold flex items-center">
              gentle w
              <span className="inline-block align-middle" style={{ lineHeight: 0, marginLeft: '-2px', marginRight: '-2px' }}>
                <Image
                  src={resolvedTheme === "dark" ? gentleLogoWhite : gentleLogoDark}
                  alt="gentle walker logo"
                  height={24}
                  className="w-auto h-7 mt-2 inline-block"
                  style={{ display: 'inline', verticalAlign: 'middle' }}
                  priority
                />
              </span>
              lker
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationCenter />
            <ModeToggle />
            <UserProfile />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="w-full">
        <div className="max-w-6xl mx-auto py-6 px-4">
          <div className="grid w-full grid-cols-9 gap-1">
            {navTabs.map(tab => {
              const isActive = activeTab === tab.value
              return (
                <Link
                  key={tab.value}
                  href={tab.href}
                  className={`flex items-center gap-2 justify-center rounded-md px-2 py-2 text-sm font-medium transition-colors
                    ${isActive ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-accent"}
                  `}
                  prefetch={false}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="w-full max-w-6xl mx-auto pb-8 px-4">
        {children}
      </main>
    </div>
  )
} 