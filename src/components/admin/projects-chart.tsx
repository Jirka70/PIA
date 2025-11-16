"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", created: 45, fulfilled: 38 },
  { month: "Feb", created: 52, fulfilled: 45 },
  { month: "Mar", created: 48, fulfilled: 42 },
  { month: "Apr", created: 61, fulfilled: 55 },
  { month: "May", created: 55, fulfilled: 48 },
  { month: "Jun", created: 67, fulfilled: 61 },
]

export function ProjectsChart() {
  return (
    <Card className="bg-card/50 backdrop-blur-md border-border/50">
      <CardHeader>
        <CardTitle>Project Statistics</CardTitle>
        <CardDescription>Created vs. Fulfilled projects over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer

          config={{
            created: {
              label: "Created",
              color: "var(--chart-3)",
            },
            fulfilled: {
              label: "Fulfilled",
              color: "var(--chart-2)",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>

              <CartesianGrid
                stroke="var(--muted-foreground)"
                strokeDasharray="3 3"
                strokeOpacity={0.2}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--foreground)" }}
                tickLine={{ stroke: "var(--muted-foreground)", strokeOpacity: 0.4 }}
                axisLine={{ stroke: "var(--muted-foreground)", strokeOpacity: 0.4 }}
              />
              <YAxis
                tick={{ fill: "var(--foreground)" }}
                tickLine={{ stroke: "var(--muted-foreground)", strokeOpacity: 0.4 }}
                axisLine={{ stroke: "var(--muted-foreground)", strokeOpacity: 0.4 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="created" fill="var(--color-created)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fulfilled" fill="var(--color-fulfilled)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
