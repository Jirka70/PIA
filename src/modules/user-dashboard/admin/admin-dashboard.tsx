"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, Users, MessageSquare, Activity } from "lucide-react"
import { StatsCards } from "@/components/admin/stats-cards"
import { ProjectsChart } from "@/components/admin/projects-chart"
import { UsersManagement } from "@/components/admin/user-management/users-management"
import { MessagingPanel } from "@/components/admin/messaging-panel"
import { RecentActivity } from "@/components/admin/recent-activity"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-pretty text-sm text-muted-foreground sm:text-base mt-2">
                Manage translators, customers, and projects from one central location.
              </p>
            </div>

            
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card/50 backdrop-blur-md border border-border/50 p-1">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="messaging" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Messaging</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <StatsCards />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ProjectsChart />
              </div>
              <div>
                <RecentActivity onViewAll={() => setActiveTab("activity")} />
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          {/* Messaging Tab */}
          <TabsContent value="messaging">
            <MessagingPanel />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <RecentActivity onViewAll={() => {}} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
