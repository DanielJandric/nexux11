"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  name: string;
  organization: {
    name: string;
  };
  _count: {
    properties: number;
    tickets: number;
  };
}

export default function Overview() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data: User = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome, {loading ? "..." : error ? "User" : user?.name || "User"}!</CardTitle>
        <CardDescription>
          Here's a quick overview of your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading overview...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : user ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground">Organization</div>
              <div className="text-lg font-bold">{user.organization?.name}</div>
            </div>
             <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground">Properties Managed</div>
              <div className="text-lg font-bold">{user._count?.properties ?? 0}</div>
            </div>
             <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground">Open Tickets</div>
              <div className="text-lg font-bold">{user._count?.tickets ?? 0}</div>
            </div>
          </div>
        ) : (
           <p>No overview data available.</p>
        )}
      </CardContent>
    </Card>
  )
} 