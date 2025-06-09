"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, UserCheck, UserX } from "lucide-react"

interface PropertyStatsData {
  total: number;
  occupied: number;
  vacant: number;
}

export default function PropertyStats() {
  const [stats, setStats] = useState<PropertyStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/properties/stats`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch property stats");
        }
        const data: PropertyStatsData = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [])


  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Stats</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p>Loading...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {stats && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <span>Total Properties</span>
              </div>
              <span className="font-bold">{stats.total}</span>
            </div>
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-muted-foreground" />
                <span>Occupied</span>
              </div>
              <span className="font-bold">{stats.occupied}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserX className="w-5 h-5 text-muted-foreground" />
                <span>Vacant</span>
              </div>
              <span className="font-bold">{stats.vacant}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 