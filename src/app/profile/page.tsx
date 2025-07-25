"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ProfileDisplay } from "@/components/profile/profile-display";
import { ProfileForm } from "@/components/profile/profile-form";
import { Button } from "@/components/ui/button";
import { Edit, X } from "lucide-react";
import { getUserProfile } from "@/lib/actions";
import { User } from "@/lib/schema";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Shared profile loading logic
  const loadProfile = async (showLoading = false) => {
    if (!session?.user) return;

    if (showLoading) setIsLoading(true);

    try {
      const result = await getUserProfile();
      if (result.success && "data" in result) {
        setProfileData(result.data as User);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile(true);
  }, [session?.user]);

  if (!session) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">
          Please sign in to view your profile.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Edit Toggle */}
      <div className="flex justify-end">
        <Button
          variant={isEditing ? "outline" : "default"}
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center"
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Profile Content */}
      {isEditing ? (
        <ProfileForm
          initialData={profileData}
          onSave={async () => {
            setIsEditing(false);
            await loadProfile(false);
          }}
        />
      ) : (
        <ProfileDisplay profileData={profileData} />
      )}
    </div>
  );
}
