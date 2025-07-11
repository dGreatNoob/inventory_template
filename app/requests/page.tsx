import { MainLayout } from "@/components/main-layout"
import { RequestSlips } from "@/components/request-slips"

export default function RequestSlipsPage() {
  return (
    <MainLayout currentPage="Request Slips">
      <RequestSlips />
    </MainLayout>
  )
} 