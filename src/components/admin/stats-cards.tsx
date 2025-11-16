"use client"

import { Users, FileText, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    title: "Total Users",
    value: "248",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Users,
    description: "156 Translators, 92 Customers",
  },
  {
    title: "Active Projects",
    value: "64",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Clock,
    description: "Currently in progress",
  },
  {
    title: "Completed Projects",
    value: "1,247",
    change: "+23.1%",
    changeType: "positive" as const,
    icon: CheckCircle2,
    description: "All time total",
  },
  {
    title: "Total Projects",
    value: "1,311",
    change: "+18.7%",
    changeType: "positive" as const,
    icon: FileText,
    description: "Created this year",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="bg-card/50 backdrop-blur-md border-border/50 transition-all hover:shadow-lg hover:bg-card/70"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-2 text-xs">
              <span
                className={
                  stat.changeType === "positive"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }
              >
                {stat.change}
              </span>
              <span className="text-muted-foreground">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
