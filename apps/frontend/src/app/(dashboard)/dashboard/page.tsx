import Overview from "@/components/dashboard/overview"
import RecentTickets from "@/components/dashboard/recent-tickets"
import PropertyStats from "@/components/dashboard/property-stats"

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Overview />
        <RecentTickets />
      </div>
      <div className="space-y-6">
        <PropertyStats />
      </div>
    </div>
  )
} 