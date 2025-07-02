"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { YearlyChart } from "@/components/charts/yearly-chart";
import { MonthlyChart } from "@/components/charts/monthly-chart";
import { getYearlyTotals, getMonthlyTotals } from "@/lib/actions";

export function AnalyticsTab() {
  const { data: yearlyData, isLoading: yearlyLoading } = useQuery({
    queryKey: ["yearly-totals"],
    queryFn: getYearlyTotals,
  });

  const { data: monthlyData, isLoading: monthlyLoading } = useQuery({
    queryKey: ["monthly-totals"],
    queryFn: () => getMonthlyTotals(),
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yearly Totals Chart */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>📊 Yearly Totals</CardTitle>
            <CardDescription>
              Hall of Fame entries by calendar year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <YearlyChart
              data={yearlyData?.success ? yearlyData.data || [] : []}
              isLoading={yearlyLoading}
            />
          </CardContent>
        </Card>

        {/* Monthly Trends Chart */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>📈 Monthly Trends</CardTitle>
            <CardDescription>Month-by-month entry patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyChart
              data={monthlyData?.success ? monthlyData.data || [] : []}
              isLoading={monthlyLoading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics Coming Soon */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>🚧 More Analytics Coming Soon</CardTitle>
          <CardDescription>
            Additional charts and insights will be added here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            • Date-in-month analysis
            <br />
            • Streak analysis charts
            <br />
            • Name frequency visualizations
            <br />• Gap analysis timeline
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
