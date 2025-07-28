"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getUserProfile } from "@/actions";
import { User } from "@/db";

interface UserProfileContextType {
  profileData: User | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

export function UserProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (showLoading = true) => {
    if (!session?.user) {
      setProfileData(null);
      return;
    }

    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      const result = await getUserProfile();
      if (result.success && "data" in result) {
        setProfileData(result.data as User);
      } else {
        setError(result.error || "Failed to load profile");
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      setError("Failed to load profile");
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [session?.user]);

  const refreshProfile = async () => {
    await loadProfile(false);
  };

  useEffect(() => {
    loadProfile(true);
  }, [session?.user, loadProfile]);

  const value: UserProfileContextType = {
    profileData,
    isLoading,
    error,
    refreshProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}
