"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Clock, TrendingUp } from "lucide-react"

export default function StatsSection() {
  const stats = [
    {
      id: 1,
      title: "Posts Published",
      value: 47,
      icon: FileText,
      color: "#22C55E",
      change: "+12% from last month",
    },
    {
      id: 2,
      title: "Total Views",
      value: "12.5K",
      icon: Users,
      color: "#0F2A43",
      change: "+8% from last month",
    },
    {
      id: 3,
      title: "Average Time",
      value: "3:24",
      icon: Clock,
      color: "#6366F1",
      change: "-2% from last month",
    },
    {
      id: 4,
      title: "Engagement Rate",
      value: "8.7%",
      icon: TrendingUp,
      color: "#F59E0B",
      change: "+5% from last month",
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

