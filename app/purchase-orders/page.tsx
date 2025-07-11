import { MainLayout } from "@/components/main-layout"
import { PurchaseOrders } from "@/components/purchase-orders"

export default function PurchaseOrdersPage() {
  return (
    <MainLayout currentPage="Purchase Orders">
      <PurchaseOrders />
    </MainLayout>
  )
} 