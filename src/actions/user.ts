"use server";

import { db, users, type User } from "@/db";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS, CACHE_DURATION } from "./cache";

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

    const { id: userId } = session.user;

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

    try {
      const result = await db
        .update(users)
        .set({
          ...cleanedData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      // Check if any rows were actually updated
      if (result.rowCount === 0) {
        console.error("No user found with ID:", userId);
        return { success: false, error: "User not found" };
      }

      console.log("updateUserProfile", cleanedData);
    } catch (dbError) {
      console.error("Database error in updateUserProfile:", dbError);
      return { success: false, error: "Failed to update profile in database" };
    }

    // Revalidate user profile cache
    revalidateTag(CACHE_TAGS.USER_PROFILE, "max");

    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

const getUserProfileCached = unstable_cache(
  async (userId: string) => {
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

export async function getUserProfile(userId?: string) {
  try {
    const session = await getServerSession(authOptions);
    const targetUserId = userId || (session?.user?.id as string);

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

    const userId = session.user.id as string;

    try {
      const result = await db
        .update(users)
        .set({
          emailNotificationsEnabled: enabled,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      // Check if any rows were actually updated
      if (result.rowCount === 0) {
        console.error("No user found with ID:", userId);
        return { success: false, error: "User not found" };
      }
    } catch (dbError) {
      console.error("Database error in toggleEmailNotifications:", dbError);
      return {
        success: false,
        error: "Failed to update notification settings in database",
      };
    }

    // Revalidate user profile cache
    revalidateTag(CACHE_TAGS.USER_PROFILE, "max");

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

    const { id: userId } = session.user;

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

    const userId = session.user.id as string;

    // Delete user record (CASCADE will handle related records)
    await db.delete(users).where(eq(users.id, userId));

    // Revalidate caches
    revalidateTag(CACHE_TAGS.USER_PROFILE, "max");

    return { success: true };
  } catch (error) {
    console.error("Error deleting user account:", error);
    return { success: false, error: "Failed to delete account" };
  }
}
