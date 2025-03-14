"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Clock, TrendingUp, Loader2 } from "lucide-react"
import axios from "axios"

export default function StatsSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statistics, setStatistics] = useState(null)
  const [hasData, setHasData] = useState(false)

  const fetchStatistics = useCallback(async () => {
    // If we already have data, don't fetch again
    if (hasData) return;

    let retries = 3;
    let attempt = 0;

    while (attempt < retries) {
      try {
        // Get auth token from cookie
        const authToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('authToken='))
          ?.split('=')[1];

        if (!authToken) {
          throw new Error('Authentication token not found');
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}api/settings/statistics`, 
          {
            headers: {
              Authorization: `Bearer ${authToken}`
            },
            withCredentials: true,
            timeout: 15000 // Increased timeout to 15 seconds
          }
        );
        
        if (response.status === 200 && response.data) {
          setStatistics(response.data);
          setError(null);
          setHasData(true); // Mark that we have received data
          break; // Success, exit retry loop
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (err) {
        attempt++;
        console.error(`Error fetching statistics (attempt ${attempt}/${retries}):`, err);
        
        if (err.code === 'ECONNABORTED') {
          setError('Request timed out. Please check your connection and try again.');
        } else if (attempt === retries) {
          setError(err.response?.data?.message || 'Failed to load statistics after multiple attempts');
        } else {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
      }
    }
    
    setIsLoading(false);
  }, [hasData]); // Only recreate the callback if hasData changes

  useEffect(() => {
    if (!hasData) {
      fetchStatistics();
    }
  }, [fetchStatistics, hasData]); // Include hasData in the dependency array

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0F2A43]">Activity Statistics</CardTitle>
          <CardDescription>Overview of your content performance</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-[#22C55E]" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0F2A43]">Activity Statistics</CardTitle>
          <CardDescription>Overview of your content performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-center">{error}</div>
        </CardContent>
      </Card>
    )
  }

  const stats = [
    {
      id: 1,
      title: "Total Feeds",
      value: statistics?.total_feeds || 0,
      icon: FileText,
      color: "#22C55E",
      change: "Active RSS feeds",
    },
    {
      id: 2,
      title: "Published Articles",
      value: statistics?.publishd_articles || 0,
      icon: Users,
      color: "#0F2A43",
      change: "Articles published",
    },
    {
      id: 3,
      title: "Scheduled Articles",
      value: statistics?.scheduled_articles || 0,
      icon: Clock,
      color: "#6366F1",
      change: "Pending publication",
    },
    {
      id: 4,
      title: "Total Articles",
      value: (statistics?.publishd_articles || 0) + (statistics?.scheduled_articles || 0),
      icon: TrendingUp,
      color: "#F59E0B",
      change: "Total managed articles",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#0F2A43]">Activity Statistics</CardTitle>
        <CardDescription>Overview of your content performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}>
              <Card className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                      <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                    </div>
                    <div
                      className="p-3 rounded-full"
                      style={{ backgroundColor: `${stat.color}20` }}>
                      <stat.icon size={24} style={{ color: stat.color }} />
                    </div>
                  </div>
                </div>
                <div className="h-1" style={{ backgroundColor: stat.color }}></div>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

