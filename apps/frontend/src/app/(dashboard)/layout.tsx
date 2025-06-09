"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, Building2, Ticket, Bell, Settings } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Properties", href: "/dashboard/properties", icon: Building2 },
  { name: "Tickets", href: "/dashboard/tickets", icon: Ticket },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex md:flex-col w-64 bg-muted border-r">
        <div className="h-16 flex items-center justify-center border-b">
          <span className="font-bold text-lg">Nexus10</span>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link href={item.href} legacyBehavior>
                  <a
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-accent transition-colors",
                      pathname === item.href && "bg-accent text-primary"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-16 flex items-center px-6 border-b bg-background sticky top-0 z-10">
          <span className="font-semibold">Dashboard</span>
        </header>
        <section className="flex-1 p-6 bg-muted/50">{children}</section>
      </main>
    </div>
  )
} 