import { MainLayout } from "@/components/main-layout"
import { Inventory } from "@/components/inventory"

export default function InventoryPage() {
  return (
    <MainLayout currentPage="Inventory">
      <Inventory />
    </MainLayout>
  )
} 