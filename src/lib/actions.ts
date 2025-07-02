"use server";

import { db } from "@/lib/db";
import { hallOfFameEntries } from "@/lib/schema";
import { sql, desc, asc, count, eq, and, gte, lte } from "drizzle-orm";
import {
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  format,
  getDaysInMonth,
} from "date-fns";
import { unstable_cache } from "next/cache";

// Cache tags for different types of data
const CACHE_TAGS = {
  ALL_ENTRIES: "all-entries",
  YEARLY_TOTALS: "yearly-totals",
  MONTHLY_TOTALS: "monthly-totals",
  DAILY_TOTALS: "daily-totals",
  NAMES: "names",
  STATS: "stats",
} as const;

// Cache duration in seconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60;

export const getAllEntries = unstable_cache(
  async () => {
    try {
      const entries = await db
        .select()
        .from(hallOfFameEntries)
        .orderBy(desc(hallOfFameEntries.parsedDate));

      return { success: true, data: entries };
    } catch (error) {
      console.error("Error fetching entries:", error);
      return { success: false, error: "Failed to fetch entries" };
    }
  },
  ["get-all-entries"],
  {
    tags: [CACHE_TAGS.ALL_ENTRIES],
    revalidate: CACHE_DURATION,
  }
);

export const getYearlyTotals = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          year: sql<string>`EXTRACT(YEAR FROM ${hallOfFameEntries.parsedDate})`,
          count: count(),
        })
        .from(hallOfFameEntries)
        .groupBy(sql`EXTRACT(YEAR FROM ${hallOfFameEntries.parsedDate})`)
        .orderBy(asc(sql`EXTRACT(YEAR FROM ${hallOfFameEntries.parsedDate})`));

      return { success: true, data: result };
    } catch (error) {
      console.error("Error fetching yearly totals:", error);
      return { success: false, error: "Failed to fetch yearly totals" };
    }
  },
  ["get-yearly-totals"],
  {
    tags: [CACHE_TAGS.YEARLY_TOTALS],
    revalidate: CACHE_DURATION,
  }
);

export const getMonthlyTotals = unstable_cache(
  async (year?: number) => {
    try {
      const yearFilter = year
        ? and(
            gte(
              hallOfFameEntries.parsedDate,
              startOfYear(new Date(year, 0, 1))
            ),
            lte(hallOfFameEntries.parsedDate, endOfYear(new Date(year, 0, 1)))
          )
        : undefined;

      const result = await db
        .select({
          year: sql<string>`EXTRACT(YEAR FROM ${hallOfFameEntries.parsedDate})`,
          month: sql<string>`EXTRACT(MONTH FROM ${hallOfFameEntries.parsedDate})`,
          count: count(),
        })
        .from(hallOfFameEntries)
        .where(yearFilter)
        .groupBy(
          sql`EXTRACT(YEAR FROM ${hallOfFameEntries.parsedDate})`,
          sql`EXTRACT(MONTH FROM ${hallOfFameEntries.parsedDate})`
        )
        .orderBy(
          asc(sql`EXTRACT(YEAR FROM ${hallOfFameEntries.parsedDate})`),
          asc(sql`EXTRACT(MONTH FROM ${hallOfFameEntries.parsedDate})`)
        );

      return { success: true, data: result };
    } catch (error) {
      console.error("Error fetching monthly totals:", error);
      return { success: false, error: "Failed to fetch monthly totals" };
    }
  },
  ["get-monthly-totals"],
  {
    tags: [CACHE_TAGS.MONTHLY_TOTALS],
    revalidate: CACHE_DURATION,
  }
);

export const getDailyTotalsForMonth = unstable_cache(
  async (year: number, month: number) => {
    try {
      const startDate = startOfMonth(new Date(year, month - 1, 1));
      const endDate = endOfMonth(new Date(year, month - 1, 1));

      const result = await db
        .select({
          date: sql<string>`DATE(${hallOfFameEntries.parsedDate})`,
          count: count(),
        })
        .from(hallOfFameEntries)
        .where(
          and(
            gte(hallOfFameEntries.parsedDate, startDate),
            lte(hallOfFameEntries.parsedDate, endDate)
          )
        )
        .groupBy(sql`DATE(${hallOfFameEntries.parsedDate})`)
        .orderBy(asc(sql`DATE(${hallOfFameEntries.parsedDate})`));

      // Create a complete month array with all days, filling missing days with 0
      const daysInMonth = getDaysInMonth(new Date(year, month - 1));
      const dailyData = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = format(new Date(year, month - 1, day), "yyyy-MM-dd");
        const existingData = result.find((r) => r.date === dateStr);

        dailyData.push({
          date: dateStr,
          count: existingData ? existingData.count : 0,
        });
      }

      return { success: true, data: dailyData };
    } catch (error) {
      console.error("Error fetching daily totals:", error);
      return { success: false, error: "Failed to fetch daily totals" };
    }
  },
  ["get-daily-totals"],
  {
    tags: [CACHE_TAGS.DAILY_TOTALS],
    revalidate: CACHE_DURATION,
  }
);

export const getMostCommonNames = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          name: hallOfFameEntries.name,
          count: count(),
        })
        .from(hallOfFameEntries)
        .groupBy(hallOfFameEntries.name)
        .orderBy(desc(count()))
        .limit(10);

      return { success: true, data: result };
    } catch (error) {
      console.error("Error fetching most common names:", error);
      return { success: false, error: "Failed to fetch most common names" };
    }
  },
  ["get-most-common-names"],
  {
    tags: [CACHE_TAGS.NAMES],
    revalidate: CACHE_DURATION,
  }
);

export const getUniqueNames = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          name: hallOfFameEntries.name,
          firstEntry: sql<string>`MIN(${hallOfFameEntries.parsedDate})`,
          totalEntries: count(),
        })
        .from(hallOfFameEntries)
        .groupBy(hallOfFameEntries.name)
        .orderBy(desc(count()))
        .limit(20);

      return { success: true, data: result };
    } catch (error) {
      console.error("Error fetching unique names:", error);
      return { success: false, error: "Failed to fetch unique names" };
    }
  },
  ["get-unique-names"],
  {
    tags: [CACHE_TAGS.NAMES],
    revalidate: CACHE_DURATION,
  }
);

export const getEntriesForName = unstable_cache(
  async (name: string) => {
    try {
      const entries = await db
        .select()
        .from(hallOfFameEntries)
        .where(eq(hallOfFameEntries.name, name))
        .orderBy(desc(hallOfFameEntries.parsedDate));

      return { success: true, data: entries };
    } catch (error) {
      console.error("Error fetching entries for name:", error);
      return { success: false, error: "Failed to fetch entries for name" };
    }
  },
  ["get-entries-for-name"],
  {
    tags: [CACHE_TAGS.ALL_ENTRIES],
    revalidate: CACHE_DURATION,
  }
);

export const getLongestGap = unstable_cache(
  async () => {
    try {
      // Get all dates ordered
      const dates = await db
        .select({
          date: sql<string>`DATE(${hallOfFameEntries.parsedDate})`,
        })
        .from(hallOfFameEntries)
        .groupBy(sql`DATE(${hallOfFameEntries.parsedDate})`)
        .orderBy(asc(sql`DATE(${hallOfFameEntries.parsedDate})`));

      if (dates.length < 2) {
        return {
          success: true,
          data: { gap: 0, startDate: null, endDate: null },
        };
      }

      let longestGap = 0;
      let gapStart = "";
      let gapEnd = "";

      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1].date);
        const currentDate = new Date(dates[i].date);
        const gap =
          Math.floor(
            (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
          ) - 1;

        if (gap > longestGap) {
          longestGap = gap;
          gapStart = dates[i - 1].date;
          gapEnd = dates[i].date;
        }
      }

      return {
        success: true,
        data: {
          gap: longestGap,
          startDate: gapStart,
          endDate: gapEnd,
        },
      };
    } catch (error) {
      console.error("Error fetching longest gap:", error);
      return { success: false, error: "Failed to fetch longest gap" };
    }
  },
  ["get-longest-gap"],
  {
    tags: [CACHE_TAGS.STATS],
    revalidate: CACHE_DURATION,
  }
);

export const getLongestStreak = unstable_cache(
  async () => {
    try {
      // Get all dates with entries
      const dates = await db
        .select({
          date: sql<string>`DATE(${hallOfFameEntries.parsedDate})`,
        })
        .from(hallOfFameEntries)
        .groupBy(sql`DATE(${hallOfFameEntries.parsedDate})`)
        .orderBy(asc(sql`DATE(${hallOfFameEntries.parsedDate})`));

      if (dates.length === 0) {
        return {
          success: true,
          data: { streak: 0, startDate: null, endDate: null },
        };
      }

      let longestStreak = 1;
      let currentStreak = 1;
      let streakStart = dates[0].date;
      let streakEnd = dates[0].date;
      let currentStart = dates[0].date;

      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1].date);
        const currentDate = new Date(dates[i].date);
        const dayDiff = Math.floor(
          (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (dayDiff === 1) {
          // Consecutive day
          currentStreak++;
        } else {
          // Streak broken
          if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
            streakStart = currentStart;
            streakEnd = dates[i - 1].date;
          }
          currentStreak = 1;
          currentStart = dates[i].date;
        }
      }

      // Check final streak
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
        streakStart = currentStart;
        streakEnd = dates[dates.length - 1].date;
      }

      return {
        success: true,
        data: {
          streak: longestStreak,
          startDate: streakStart,
          endDate: streakEnd,
        },
      };
    } catch (error) {
      console.error("Error fetching longest streak:", error);
      return { success: false, error: "Failed to fetch longest streak" };
    }
  },
  ["get-longest-streak"],
  {
    tags: [CACHE_TAGS.STATS],
    revalidate: CACHE_DURATION,
  }
);

// Utility function to revalidate all caches when data changes
export async function revalidateAllCaches() {
  const { revalidateTag } = await import("next/cache");

  Object.values(CACHE_TAGS).forEach((tag) => {
    revalidateTag(tag);
  });
}
