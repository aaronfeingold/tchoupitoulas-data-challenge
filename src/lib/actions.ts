"use server";

import { db, hallOfFameEntries, users, type User } from "@/db";
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
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidateTag } from "next/cache";

// Cache tags for different types of data
const CACHE_TAGS = {
  ALL_ENTRIES: "all-entries",
  YEARLY_TOTALS: "yearly-totals",
  MONTHLY_TOTALS: "monthly-totals",
  DAILY_TOTALS: "daily-totals",
  NAMES: "names",
  STATS: "stats",
  USER_PROFILE: "user-profile",
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

// Utility function to revalidate all caches when data changes
export async function revalidateAllCaches() {
  const { revalidateTag } = await import("next/cache");

  Object.values(CACHE_TAGS).forEach((tag) => {
    revalidateTag(tag);
  });
}

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

// User Profile Management Actions

interface UpdateProfileData {
  name?: string;
  location?: string;
  favoriteIceCreamFlavor?: string;
  favoriteTopping?: string;
  favoriteBrand?: string;
  favoritePlace?: string;
  avatarSelection?: number;
}

export async function updateUserProfile(formData: FormData) {
  console.log("updateUserProfile", formData);
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const userId = parseInt(session.user.id as string);

    const updateData: UpdateProfileData = {
      name: (formData.get("name") as string) || undefined,
      location: (formData.get("location") as string) || undefined,
      favoriteIceCreamFlavor:
        (formData.get("favoriteIceCreamFlavor") as string) || undefined,
      favoriteTopping: (formData.get("favoriteTopping") as string) || undefined,
      favoriteBrand: (formData.get("favoriteBrand") as string) || undefined,
      favoritePlace: (formData.get("favoritePlace") as string) || undefined,
      avatarSelection: formData.get("avatarSelection")
        ? parseInt(formData.get("avatarSelection") as string)
        : undefined,
    };

    // Remove undefined values
    const cleanedData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined)
    );

    if (Object.keys(cleanedData).length === 0) {
      return { success: false, error: "No data to update" };
    }

    await db
      .update(users)
      .set({
        ...cleanedData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    console.log("updateUserProfile", cleanedData);

    // Revalidate user profile cache
    revalidateTag(CACHE_TAGS.USER_PROFILE);

    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

const getUserProfileCached = unstable_cache(
  async (userId: number) => {
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (user.length === 0) {
        return { success: false, error: "User not found" };
      }

      return { success: true, data: user[0] as User };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return { success: false, error: "Failed to fetch user profile" };
    }
  },
  ["get-user-profile"],
  {
    tags: [CACHE_TAGS.USER_PROFILE],
    revalidate: CACHE_DURATION,
  }
);

export async function getUserProfile(userId?: number) {
  try {
    const session = await getServerSession(authOptions);
    const targetUserId =
      userId ||
      (session?.user?.id ? parseInt(session.user.id as string) : null);

    if (!targetUserId) {
      return { success: false, error: "User ID not found" };
    }

    return await getUserProfileCached(targetUserId);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: "Failed to fetch user profile" };
  }
}

export async function toggleEmailNotifications(enabled: boolean) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const userId = parseInt(session.user.id as string);

    await db
      .update(users)
      .set({
        emailNotificationsEnabled: enabled,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Revalidate user profile cache
    revalidateTag(CACHE_TAGS.USER_PROFILE);

    return { success: true, data: { enabled } };
  } catch (error) {
    console.error("Error toggling email notifications:", error);
    return { success: false, error: "Failed to update notification settings" };
  }
}

export async function exportUserData() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const userId = parseInt(session.user.id as string);

    // Get user profile data
    const userResult = await getUserProfile(userId);
    if (!userResult.success) {
      return { success: false, error: userResult.error };
    }

    // Create comprehensive data export
    const exportData = {
      profile: (userResult as { success: true; data: User }).data,
      exportInfo: {
        exportedAt: new Date().toISOString(),
        exportedBy: userId,
        version: "1.0",
      },
      // Future: Add user activity data, predictions, etc.
    };

    return { success: true, data: exportData };
  } catch (error) {
    console.error("Error exporting user data:", error);
    return { success: false, error: "Failed to export user data" };
  }
}

export async function deleteUserAccount() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const userId = parseInt(session.user.id as string);

    // Delete user record (CASCADE will handle related records)
    await db.delete(users).where(eq(users.id, userId));

    // Revalidate caches
    revalidateTag(CACHE_TAGS.USER_PROFILE);

    return { success: true };
  } catch (error) {
    console.error("Error deleting user account:", error);
    return { success: false, error: "Failed to delete account" };
  }
}
