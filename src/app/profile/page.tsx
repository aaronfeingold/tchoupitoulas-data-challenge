"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ProfileDisplay } from "@/components/profile/profile-display";
import { ProfileForm } from "@/components/profile/profile-form";
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";
import { getUserProfile } from "@/lib/actions";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile data when session is available
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;

      setIsLoading(true);
      try {
        const result = await getUserProfile();
        if (result.success) {
          setProfileData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
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
          onSave={() => {
            setIsEditing(false);
            // Refetch profile data after save
            if (session?.user) {
              getUserProfile().then((result) => {
                if (result.success) setProfileData(result.data);
              });
            }
          }}
        />
      ) : (
        <ProfileDisplay profileData={profileData} />
      )}
    </div>
  );
}
