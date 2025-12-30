"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, CheckCircle, FileText, Star, TrendingUp } from "lucide-react"
import type { User } from "better-auth"
import { ProjectsContent } from "./translator-projects-content"
import { useTranslations } from "next-intl"

interface TranslatorDashboardProps {
  user: User
}

export const TranslatorDashboard = ({ user }: TranslatorDashboardProps) => {
  const t = useTranslations("TranslatorDashboard")
  const userName = user?.name || t("header.fallbackName")

  const translatorStats = {
    rating: 4.8,
    totalRatings: 127,
    completedProjects: 48,
    failedProjects: 2,
    activeProjects: 5,
    averageCompletionTime: "3.2 days",
    totalEarnings: "$12,450"
  }

  const recentFeedback = [
    {
      id: "1",
      projectTitle: "Website Localization",
      customerName: "Sarah Johnson",
      rating: 5,
      comment: "Excellent work! Very accurate and delivered on time.",
      date: "2025-10-15"
    },
    {
      id: "2",
      projectTitle: "Product Descriptions",
      customerName: "E-commerce Store",
      rating: 4,
      comment: "Good translation, minor adjustments needed.",
      date: "2025-10-12"
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {t("header.welcome", { name: userName })}
          </h1>
          <p className="text-muted-foreground">{t("header.subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("cards.translatorRating")}</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                {translatorStats.rating}
                <span className="text-yellow-500">★</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("cards.basedOnReviews", { count: translatorStats.totalRatings })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("cards.completedProjects")}</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{translatorStats.completedProjects}</div>
              <p className="text-xs text-muted-foreground">{t("cards.incomplete", { count: translatorStats.failedProjects })}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("cards.activeProjects")}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{translatorStats.activeProjects}</div>
              <p className="text-xs text-muted-foreground">{t("cards.currentlyAssigned")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("cards.avgCompletionTime")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{translatorStats.averageCompletionTime}</div>
              <p className="text-xs text-muted-foreground">{t("cards.perProject")}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">{t("tabs.projects")}</TabsTrigger>
            <TabsTrigger value="feedback">{t("tabs.feedback")}</TabsTrigger>
            <TabsTrigger value="performance">{t("tabs.performance")}</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <ProjectsContent user={user} />
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{t("feedback.title")}</h2>
              <p className="text-muted-foreground">{t("feedback.subtitle")}</p>
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

          <TabsContent value="performance" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{t("performance.title")}</h2>
              <p className="text-muted-foreground">{t("performance.subtitle")}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    {t("performance.qualityMetrics")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("performance.averageRating")}</span>
                    <span className="text-lg font-bold flex items-center gap-1">
                      {translatorStats.rating} <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("performance.totalReviews")}</span>
                    <span className="text-lg font-bold">{translatorStats.totalRatings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("performance.successRate")}</span>
                    <span className="text-lg font-bold">
                      {Math.round(
                        (translatorStats.completedProjects /
                          (translatorStats.completedProjects + translatorStats.failedProjects)) *
                          100
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
                    {t("performance.productivityMetrics")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("performance.completedProjects")}</span>
                    <span className="text-lg font-bold">{translatorStats.completedProjects}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("performance.avgCompletionTime")}</span>
                    <span className="text-lg font-bold">{translatorStats.averageCompletionTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("performance.activeProjects")}</span>
                    <span className="text-lg font-bold">{translatorStats.activeProjects}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>{t("performance.ratingDistribution")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = Math.floor(Math.random() * 50)
                    const percentage = (count / translatorStats.totalRatings) * 100
                    return (
                      <div key={stars} className="flex items-center gap-4">
                        <div className="flex items-center gap-1 w-20">
                          <span className="text-sm font-medium">{stars}</span>
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        </div>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div className="bg-yellow-500 rounded-full h-2" style={{ width: `${percentage}%` }} />
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
