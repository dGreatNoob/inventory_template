import { MainLayout } from "@/components/main-layout"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  return (
    <MainLayout currentPage="Dashboard">
      <Dashboard />
    </MainLayout>
  )
}
