"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, CheckCircle, FileText, Star, TrendingUp } from "lucide-react"
import type { User } from "better-auth"
import { Suspense, useState } from "react"
import { ProjectsContent } from "./translator-projects-content"

interface TranslatorDashboardProps {
  user: User
}

export const TranslatorDashboard = ({ user }: TranslatorDashboardProps) => {
  const userName = user?.name || "Translator"

  const [progress, setProgress] = useState(65)
  const [progressNote, setProgressNote] = useState("")

  const translatorStats = {
    rating: 4.8,
    totalRatings: 127,
    completedProjects: 48,
    failedProjects: 2,
    activeProjects: 5,
    averageCompletionTime: "3.2 days",
    totalEarnings: "$12,450",
  }

  /*const projects = [
    {
      id: "1",
      title: "Legal Contract Translation",
      description: "English to Spanish • 15 pages",
      status: "in_progress",
      progress: 65,
      progressNote: "Working on legal terminology verification",
      deadline: "2025-10-25",
      customerName: "John Smith",
      priority: "high",
      estimatedHours: 12,
      hoursSpent: 8,
    },
    {
      id: "2",
      title: "Technical Documentation",
      description: "English to Japanese • 25 pages",
      status: "assigned",
      progress: 0,
      progressNote: "",
      deadline: "2025-10-28",
      customerName: "Tech Corp Inc.",
      priority: "medium",
      estimatedHours: 20,
      hoursSpent: 0,
    },
    {
      id: "3",
      title: "Marketing Materials",
      description: "English to French • 8 pages",
      status: "review",
      progress: 100,
      progressNote: "Translation completed, awaiting customer review",
      deadline: "2025-10-20",
      customerName: "Marketing Agency",
      priority: "low",
      estimatedHours: 6,
      hoursSpent: 5,
    },
  ]*/

  const recentFeedback = [
    {
      id: "1",
      projectTitle: "Website Localization",
      customerName: "Sarah Johnson",
      rating: 5,
      comment: "Excellent work! Very accurate and delivered on time.",
      date: "2025-10-15",
    },
    {
      id: "2",
      projectTitle: "Product Descriptions",
      customerName: "E-commerce Store",
      rating: 4,
      comment: "Good translation, minor adjustments needed.",
      date: "2025-10-12",
    },
  ]

  const handleUpdateProgress = () => {
    // API call to update progress
    console.log("Updating progress:", { progress, progressNote })
  }

  const handleCompleteProject = (projectId: string) => {
    // API call to mark project as completed
    console.log("Completing project:", projectId)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "assigned":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Assigned</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">In Progress</Badge>
      case "review":
        return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">Under Review</Badge>
      case "completed":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="secondary">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground">Manage your translation assignments and track your performance</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Translator Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                {translatorStats.rating}
                <span className="text-yellow-500">★</span>
              </div>
              <p className="text-xs text-muted-foreground">Based on {translatorStats.totalRatings} reviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{translatorStats.completedProjects}</div>
              <p className="text-xs text-muted-foreground">{translatorStats.failedProjects} incomplete</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{translatorStats.activeProjects}</div>
              <p className="text-xs text-muted-foreground">Currently assigned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{translatorStats.averageCompletionTime}</div>
              <p className="text-xs text-muted-foreground">Per project</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="feedback">Customer Feedback</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <ProjectsContent user={user} />     
          </TabsContent>
          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Customer Feedback</h2>
              <p className="text-muted-foreground">See what customers are saying about your work</p>
            </div>

            {recentFeedback.map((feedback) => (
              <Card key={feedback.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{feedback.projectTitle}</CardTitle>
                      <CardDescription>
                        {feedback.customerName} • {feedback.date}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < feedback.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">"{feedback.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Performance Overview</h2>
              <p className="text-muted-foreground">Track your statistics and achievements</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Quality Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <span className="text-lg font-bold flex items-center gap-1">
                      {translatorStats.rating} <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Reviews</span>
                    <span className="text-lg font-bold">{translatorStats.totalRatings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="text-lg font-bold">
                      {Math.round(
                        (translatorStats.completedProjects /
                          (translatorStats.completedProjects + translatorStats.failedProjects)) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Productivity Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completed Projects</span>
                    <span className="text-lg font-bold">{translatorStats.completedProjects}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg. Completion Time</span>
                    <span className="text-lg font-bold">{translatorStats.averageCompletionTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Projects</span>
                    <span className="text-lg font-bold">{translatorStats.activeProjects}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = Math.floor(Math.random() * 50) // Mock data
                    const percentage = (count / translatorStats.totalRatings) * 100
                    return (
                      <div key={stars} className="flex items-center gap-4">
                        <div className="flex items-center gap-1 w-20">
                          <span className="text-sm font-medium">{stars}</span>
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        </div>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div className="bg-yellow-500 rounded-full h-2" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
