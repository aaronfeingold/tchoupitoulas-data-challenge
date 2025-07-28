"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/dashboard/overview-tab";
import { DataTableTab } from "@/components/dashboard/data-table-tab";
import { AnalyticsTab } from "@/components/dashboard/analytics-tab";
import { BarChart3, Table2, LayoutDashboard } from "lucide-react";
import { getAllEntries } from "@/actions";

export default function DashboardPage() {
  // Check if core data is loading
  const { isLoading } = useQuery({
    queryKey: ["all-entries"],
    queryFn: getAllEntries,
  });

  // Show loading screen while core data loads
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="/Tchoup-Dance.gif"
            alt="Loading..."
            width={128}
            height={128}
            className="object-contain"
            unoptimized
          />
          <p className="text-sm md:text-lg font-medium text-muted-foreground animate-pulse">
            Loading your sweet and tasty dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass-effect">
          <TabsTrigger value="overview" className="hover-lift">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="data-table" className="hover-lift">
            <Table2 className="h-4 w-4 mr-2" />
            Data Table
          </TabsTrigger>
          <TabsTrigger value="analytics" className="hover-lift">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="data-table" className="space-y-6">
          <DataTableTab />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
