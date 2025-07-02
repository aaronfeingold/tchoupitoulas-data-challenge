"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/dashboard/overview-tab";
import { DataTableTab } from "@/components/dashboard/data-table-tab";
import { AnalyticsTab } from "@/components/dashboard/analytics-tab";
import { BarChart3, Table, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if this is a page refresh (not a navigation)
    const navigationStart = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    const isPageRefresh = navigationStart?.type === "reload";

    // Check if we just navigated here (there will be a flag in sessionStorage)
    const justNavigated = sessionStorage.getItem("dashboard-navigation");

    if (isPageRefresh && !justNavigated) {
      // This is a page refresh, show the loader
      setIsLoading(true);

      // Wait for at least 3 seconds to show the loading.gif (same as home page)
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);

      return () => clearTimeout(timer);
    } else if (justNavigated) {
      // We just navigated here, clear the flag
      sessionStorage.removeItem("dashboard-navigation");
    }
  }, []);

  // Listen for navigation events to set the flag
  useEffect(() => {
    const handleRouteChangeStart = () => {
      // Set a flag that we're navigating to dashboard
      sessionStorage.setItem("dashboard-navigation", "true");
    };

    // This effect runs when the component mounts due to navigation
    // If we got here via router.push(), the flag should be set
    router.prefetch = router.prefetch; // Access router to ensure it's ready

    return () => {
      // Cleanup
    };
  }, [router]);

  return (
    <>
      {/* Loading Overlay - same as home page */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <img
              src="/loading.gif"
              alt="Loading..."
              className="w-32 h-32 object-contain"
            />
            <p className="text-lg font-medium text-muted-foreground animate-pulse">
              Refreshing your sweet and tasty dashboard...
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-effect">
            <TabsTrigger value="overview" className="hover-lift">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="data-table" className="hover-lift">
              <Table className="h-4 w-4 mr-2" />
              Data Table
            </TabsTrigger>
            <TabsTrigger value="analytics" className="hover-lift">
              <TrendingUp className="h-4 w-4 mr-2" />
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
    </>
  );
}
