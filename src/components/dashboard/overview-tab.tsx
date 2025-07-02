"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getAllEntries,
  getMostCommonNames,
  getLongestGap,
  getLongestStreak,
} from "@/lib/actions";
import { formatDate, formatNumber } from "@/lib/utils";
import {
  CalendarDays,
  Calendar,
  Trophy,
  Users,
  TrendingUp,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { differenceInDays } from "date-fns";

export function OverviewTab() {
  const [isNamesExpanded, setIsNamesExpanded] = useState(false);

  const { data: entriesData, isLoading: entriesLoading } = useQuery({
    queryKey: ["all-entries"],
    queryFn: getAllEntries,
  });

  const { data: namesData, isLoading: namesLoading } = useQuery({
    queryKey: ["most-common-names"],
    queryFn: getMostCommonNames,
  });

  const { data: gapData, isLoading: gapLoading } = useQuery({
    queryKey: ["longest-gap"],
    queryFn: getLongestGap,
  });

  const { data: streakData, isLoading: streakLoading } = useQuery({
    queryKey: ["longest-streak"],
    queryFn: getLongestStreak,
  });

  const entries = entriesData?.success ? entriesData.data || [] : [];
  const names = namesData?.success ? namesData.data || [] : [];
  const gap = gapData?.success ? gapData.data : null;
  const streak = streakData?.success ? streakData.data : null;

  // Calculate stats
  const totalEntries = entries?.length || 0;
  const uniqueNames = entries
    ? new Set(entries.map((entry) => entry.name)).size
    : 0;
  const dateRange =
    entries && entries.length > 0
      ? {
          earliest: entries[entries.length - 1]?.parsedDate,
          latest: entries[0]?.parsedDate,
        }
      : null;

  const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    isLoading,
  }: {
    title: string;
    value: string | number;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    isLoading: boolean;
  }) => (
    <Card className="glass-effect hover-lift">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse bg-muted h-6 w-16 rounded"></div>
        ) : (
          <div className="text-2xl font-bold text-gradient">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Entries"
          value={formatNumber(totalEntries)}
          description="Hall of Fame entries"
          icon={CalendarDays}
          isLoading={entriesLoading}
        />
        <StatCard
          title="Unique Names"
          value={formatNumber(uniqueNames)}
          description="Different participants"
          icon={Users}
          isLoading={entriesLoading}
        />
        <StatCard
          title="Longest Streak"
          value={streak ? `${streak.streak} days` : "-"}
          description="Consecutive days with entries"
          icon={TrendingUp}
          isLoading={streakLoading}
        />
        <StatCard
          title="Longest Gap"
          value={gap ? `${gap.gap} days` : "-"}
          description="Days without entries"
          icon={Clock}
          isLoading={gapLoading}
        />
      </div>

      {/* Date Range */}
      {dateRange && (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" /> Date Range
            </CardTitle>
            <CardDescription>
              Entry timeline and activity status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Earliest Entry</p>
                <p className="text-lg font-semibold">
                  {formatDate(dateRange.earliest)}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Latest Entry</p>
                <p className="text-lg font-semibold">
                  {formatDate(dateRange.latest)}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Days Since Last</p>
                <p className="text-lg font-semibold">
                  {(() => {
                    const daysSince = differenceInDays(
                      new Date(),
                      new Date(dateRange.latest)
                    );
                    return daysSince === 0
                      ? "Today"
                      : `${daysSince} ${daysSince === 1 ? "day" : "days"} ago`;
                  })()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hall of Fame (2+ Entries) */}
      <Card className="glass-effect">
        <CardHeader>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsNamesExpanded(!isNamesExpanded)}
          >
            <div>
              <CardTitle className="flex items-center">
                <Trophy className="h-4 w-4 mr-2 flex-shrink-0" /> Hall of Fame
                (2+ Entries)
              </CardTitle>
              <CardDescription>
                {(() => {
                  const hallOfFamersCount =
                    names?.filter((nameData) => nameData.count >= 2).length ||
                    0;
                  return `${hallOfFamersCount} participants with multiple Hall of Fame entries`;
                })()}
              </CardDescription>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                isNamesExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </CardHeader>
        <CardContent>
          {namesLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-muted h-8 rounded"
                ></div>
              ))}
            </div>
          ) : (
            (() => {
              const hallOfFamers =
                names?.filter((nameData) => nameData.count >= 2) || [];
              const displayedNames = isNamesExpanded
                ? hallOfFamers
                : hallOfFamers.slice(0, 10);

              return hallOfFamers.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No participants with 2+ entries yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {displayedNames.map((nameData, index) => (
                    <div
                      key={nameData.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant={index < 3 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                        <span className="font-medium">{nameData.name}</span>
                      </div>
                      <Badge variant="outline">{nameData.count} entries</Badge>
                    </div>
                  ))}
                  {!isNamesExpanded && hallOfFamers.length > 10 && (
                    <p className="text-sm text-muted-foreground text-center pt-2 border-t">
                      Click to see {hallOfFamers.length - 10} more hall of
                      famers...
                    </p>
                  )}
                </div>
              );
            })()
          )}
        </CardContent>
      </Card>
    </div>
  );
}
