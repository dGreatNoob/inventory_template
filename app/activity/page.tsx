import { MainLayout } from "@/components/main-layout"
import { ActivityLog } from "@/components/activity-log"

export default function ActivityLogPage() {
  return (
    <MainLayout currentPage="Activity Log">
      <ActivityLog />
    </MainLayout>
  )
} 