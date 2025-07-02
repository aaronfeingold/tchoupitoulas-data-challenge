import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/dashboard/overview-tab";
import { DataTableTab } from "@/components/dashboard/data-table-tab";
import { AnalyticsTab } from "@/components/dashboard/analytics-tab";
import { BarChart3, Table, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
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
  );
}
