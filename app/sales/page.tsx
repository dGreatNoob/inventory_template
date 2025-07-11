import { MainLayout } from "@/components/main-layout"
import { SalesOrders } from "@/components/sales-orders"

export default function SalesPage() {
  return (
    <MainLayout currentPage="Sales Orders">
      <SalesOrders />
    </MainLayout>
  )
} 