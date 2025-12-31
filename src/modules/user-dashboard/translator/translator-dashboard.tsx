"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlarmClock, Award, CheckCircle, FileText, MessagesSquare, Sparkles, Star, TrendingUp } from "lucide-react"
import type { User } from "better-auth"
import { ProjectsContent } from "./translator-projects-content"
import { useTranslations } from "next-intl"
import { useTRPC } from "@/trpc/client"

interface TranslatorDashboardProps {
  user: User
}

export const TranslatorDashboard = ({ user }: TranslatorDashboardProps) => {
  const t = useTranslations("TranslatorDashboard")
  const trpc = useTRPC()
  const userName = user?.name || t("header.fallbackName")

  const defaultTranslatorStats = {
    totalReviews: 127,
    completedProjects: 48,
    failedProjects: 2,
    activeProjects: 5,
    averageCompletionTime: "3.2 days",
    totalEarnings: "$12,450"
  }

  const { data: ratingsData } = useQuery({
    ...trpc.users.getTranslatorAverageRatings.queryOptions({
      translatorId: user.id
    }),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  })

  const { data: projectStatusCounts } = useQuery({
    ...trpc.projects.getProjectStatusCounts.queryOptions({
      translatorId: user.id
    }),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  })

  const { data: ratingDistribution } = useQuery({
    ...trpc.reviews.getTranslatorRatingDistribution.queryOptions({
      translatorId: user.id
    }),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  })

  const translatorStats = {
    ...defaultTranslatorStats,
    rating: ratingsData?.averages.overall ?? 0,
    totalReviews: ratingsData?.averages.totalReviews ?? defaultTranslatorStats.totalReviews,
    quality: ratingsData?.averages.quality ?? 0,
    communication: ratingsData?.averages.communication ?? 0,
    punctuality: ratingsData?.averages.punctuality ?? 0,
    completedProjects: projectStatusCounts?.completed ?? defaultTranslatorStats.completedProjects,
    activeProjects: projectStatusCounts?.active ?? defaultTranslatorStats.activeProjects,
    failedProjects: projectStatusCounts?.cancelled ?? defaultTranslatorStats.failedProjects
  }

  const formatRating = (value: number) => Number(value).toFixed(1)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {t("header.welcome", { name: userName })}
          </h1>
          <p className="text-muted-foreground">{t("header.subtitle")}</p>
        </div>

        {/* --- STATS CARDS (new layout) --- */}
<div className="grid gap-6 lg:grid-cols-3 mb-8">
  {/* HERO RATING CARD (wide) */}
  <Card className="lg:col-span-2">
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
      <div className="space-y-1">
        <CardTitle className="text-sm font-medium">{t("cards.translatorRating")}</CardTitle>
        <CardDescription>
          {t("cards.basedOnReviews", { count: translatorStats.totalReviews })}
        </CardDescription>
      </div>
      <Star className="h-4 w-4 text-yellow-500" />
    </CardHeader>

    {/* Inside: 2-column content so it uses width instead of height */}
    <CardContent className="grid gap-6 md:grid-cols-2">
      {/* Left: headline */}
      <div className="space-y-4">
        <div className="text-4xl font-bold leading-none flex items-center gap-2">
          {formatRating(translatorStats.rating)}
          <span className="text-yellow-500 text-2xl leading-none">★</span>
        </div>

        <p className="text-xs text-muted-foreground">
          {t("cards.basedOnReviews", { count: translatorStats.totalReviews })}
        </p>

      </div>

      {/* Right: breakdown metrics */}
      <div className="grid grid-cols-2 gap-3 text-sm content-start">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <div>
            <div className="text-muted-foreground">{t("performance.quality")}</div>
            <div className="font-semibold">{formatRating(translatorStats.quality)}/5</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MessagesSquare className="h-4 w-4 text-sky-500" />
          <div>
            <div className="text-muted-foreground">{t("performance.communication")}</div>
            <div className="font-semibold">{formatRating(translatorStats.communication)}/5</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AlarmClock className="h-4 w-4 text-emerald-500" />
          <div>
            <div className="text-muted-foreground">{t("performance.punctuality")}</div>
            <div className="font-semibold">{formatRating(translatorStats.punctuality)}/5</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <div>
            <div className="text-muted-foreground">{t("performance.averageRating")}</div>
            <div className="font-semibold">{formatRating(translatorStats.rating)}/5</div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* RIGHT STACK (3 KPI cards) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("cards.completedProjects")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{translatorStats.completedProjects}</div>
            <p className="text-xs text-muted-foreground">
              {t("cards.incomplete", { count: translatorStats.failedProjects })}
            </p>
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
      </div>
    </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">{t("tabs.projects")}</TabsTrigger>
            <TabsTrigger value="performance">{t("tabs.performance")}</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <ProjectsContent user={user} />
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
                      {formatRating(translatorStats.rating)} <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("performance.totalReviews")}</span>
                    <span className="text-lg font-bold">{translatorStats.totalReviews}</span>
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
                    <span className="text-sm text-muted-foreground">{t("performance.activeProjects")}</span>
                    <span className="text-lg font-bold">{translatorStats.activeProjects}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>{t("performance.ratingDistribution")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      {
                        key: "quality",
                        label: t("performance.quality"),
                        icon: <Sparkles className="h-4 w-4 text-amber-500" />,
                        barClass: "bg-amber-500"
                      },
                      {
                        key: "communication",
                        label: t("performance.communication"),
                        icon: <MessagesSquare className="h-4 w-4 text-sky-500" />,
                        barClass: "bg-sky-500"
                      },
                      {
                        key: "punctuality",
                        label: t("performance.punctuality"),
                        icon: <AlarmClock className="h-4 w-4 text-emerald-500" />,
                        barClass: "bg-emerald-500"
                      },
                      {
                        key: "overall",
                        label: t("performance.averageRating"),
                        icon: <Star className="h-4 w-4 text-yellow-500" />,
                        barClass: "bg-yellow-500"
                      }
                    ].map(({ key, label, barClass, icon }) => {
                      const counts = ratingDistribution?.distribution?.[key as keyof typeof ratingDistribution["distribution"]] as
                        | Record<number, number>
                        | undefined;
                      const totalForAspect =
                        (counts ? Object.values(counts).reduce((sum, val) => sum + val, 0) : 0) ||
                        translatorStats.totalReviews;

                      return (
                        <Card key={key}>
                          <CardHeader className="flex items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                              {icon}
                              {label}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {[5, 4, 3, 2, 1].map((stars) => {
                              const count = counts?.[stars] ?? 0
                              const percentage = totalForAspect ? (count / totalForAspect) * 100 : 0
                              return (
                                <div key={stars} className="flex items-center gap-3">
                                  <div className="flex items-center gap-1 w-16">
                                    <span className="text-sm font-medium">{stars}</span>
                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                  </div>
                                  <div className="flex-1 bg-muted rounded-full h-2">
                                    <div className={`${barClass} rounded-full h-2`} style={{ width: `${percentage}%` }} />
                                  </div>
                                  <span className="text-xs text-muted-foreground w-10 text-right">{count}</span>
                                </div>
                              )
                            })}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
