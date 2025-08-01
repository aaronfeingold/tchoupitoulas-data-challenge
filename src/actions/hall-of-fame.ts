"use server";

import { db, hallOfFameEntries } from "@/db";
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
import { CACHE_TAGS, CACHE_DURATION } from "./cache";

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

// TODO: This is not used anywhere, but it will be used soon..
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

export const getTopHallOfFamers = unstable_cache(
  async () => {
    try {
      const result = await db.execute(sql`
        WITH completion_stats AS (
          SELECT
            name,
            COUNT(*) as actual_entries,
            MAX(COALESCE(completion_count, 1)) as max_implied_count
          FROM hall_of_fame_entries
          GROUP BY name
        )
        SELECT
          name,
          GREATEST(actual_entries, max_implied_count) as count
        FROM completion_stats
        WHERE GREATEST(actual_entries, max_implied_count) >= 2
        ORDER BY count DESC, name ASC
      `);

      return { success: true, data: result.rows };
    } catch (error) {
      console.error("Error fetching most common names:", error);
      return { success: false, error: "Failed to fetch most common names" };
    }
  },
  ["get-top-hall-of-famers"],
  {
    tags: [CACHE_TAGS.NAMES],
    revalidate: CACHE_DURATION,
  }
);

// TODO: This is not used anywhere, but it will be used to analyze names...
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

// TODO: This is not used anywhere, but it will be used to analyze names...
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

export const getYoungest = unstable_cache(
  async () => {
    try {
      const result = await db.execute(sql`
        SELECT name, age, ROUND(age/365.0, 1) as age_years
        FROM hall_of_fame_entries
        WHERE age IS NOT NULL
        ORDER BY age ASC
        LIMIT 1;
      `);

      return { success: true, data: result.rows[0] || null };
    } catch (error) {
      console.error("Error fetching youngest hall of famer:", error);
      return {
        success: false,
        error: "Failed to fetch youngest hall of famer",
      };
    }
  },
  ["get-youngest"],
  {
    tags: [CACHE_TAGS.STATS],
    revalidate: CACHE_DURATION,
  }
);

export const getFastest = unstable_cache(
  async () => {
    try {
      const result = await db.execute(sql`
        SELECT name, elapsed_time,
               FLOOR(elapsed_time / 60) as minutes,
               (elapsed_time % 60) as seconds,
               ROUND(elapsed_time / 60.0, 2) as minutes_decimal
        FROM hall_of_fame_entries
        WHERE elapsed_time IS NOT NULL
        ORDER BY elapsed_time ASC
        LIMIT 1;
      `);

      return { success: true, data: result.rows[0] || null };
    } catch (error) {
      console.error("Error fetching fastest completion:", error);
      return { success: false, error: "Failed to fetch fastest completion" };
    }
  },
  ["get-fastest"],
  {
    tags: [CACHE_TAGS.STATS],
    revalidate: CACHE_DURATION,
  }
);