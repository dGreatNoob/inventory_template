import { MainLayout } from "@/components/main-layout"
import { Finance } from "@/components/finance"

export default function FinancePage() {
  return (
    <MainLayout currentPage="Finance">
      <Finance />
    </MainLayout>
  )
} 