"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ProfileDisplay } from "@/components/profile/profile-display";
import { ProfileForm } from "@/components/profile/profile-form";
import { Button } from "@/components/ui/button";
import { Edit, X } from "lucide-react";
import { useUserProfile } from "@/contexts/user-profile-context";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { profileData, isLoading, refreshProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);

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
            await refreshProfile();
          }}
        />
      ) : (
        <ProfileDisplay profileData={profileData} />
      )}
    </div>
  );
}
