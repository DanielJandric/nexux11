"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface Ticket {
  id: string;
  title: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
}

export default function RecentTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTickets() {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tickets?limit=5&sortBy=createdAt&sortOrder=desc`, {
           headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch recent tickets");
        }
        const data: Ticket[] = await response.json();
        setTickets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, [])


  const getStatusVariant = (status: Ticket['status']) => {
    switch (status) {
      case 'OPEN':
        return 'destructive'
      case 'IN_PROGRESS':
        return 'outline'
      case 'CLOSED':
        return 'secondary'
      default:
        return 'default'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
        <CardDescription>A summary of the latest support tickets.</CardDescription>
      </CardHeader>
      <CardContent>
         {loading && <p>Loading...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {tickets.length > 0 ? (
          <ul className="space-y-4">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="flex items-center justify-between">
                 <Link href={`/dashboard/tickets/${ticket.id}`} className="hover:underline">
                  <span className="font-medium">{ticket.title}</span>
                </Link>
                <Badge variant={getStatusVariant(ticket.status)}>
                  {ticket.status.replace('_', ' ')}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No recent tickets found.</p>
        )}
      </CardContent>
       <CardFooter>
        <Button asChild size="sm" className="w-full">
          <Link href="/dashboard/tickets">
            View All Tickets <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
} 