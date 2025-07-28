"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ProfileDisplay } from "@/components/profile/profile-display";
import { ProfileForm } from "@/components/profile/profile-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, X, Mail, MapPin, IceCream, LogIn } from "lucide-react";
import { useUserProfile } from "@/contexts/user-profile-context";
import { SignInButton } from "@/components/auth/sign-in-button";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { profileData, isLoading, refreshProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);

  if (!session) {
    return (
      <div className="space-y-6">
        {/* Call to Action Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to customize your profile and track your Hall of Fame journey
          </p>
          <SignInButton />
        </div>

        {/* Profile Preview - Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 opacity-60">
          {/* Basic Information Preview */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-mint to-pink p-2 flex items-center justify-center">
                    <IceCream size={40} className="text-white" />
                  </div>
                  <div>
                    <div className="h-6 bg-muted rounded w-32 mb-2"></div>
                    <p className="text-muted-foreground">Hall of Fame Explorer</p>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="h-4 bg-muted rounded w-48"></div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="h-4 bg-muted rounded w-32"></div>
              </div>
            </CardContent>
          </Card>

          {/* Ice Cream Preferences Preview */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center">
                <IceCream className="h-5 w-5 mr-2" />
                Ice Cream Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Favorite Flavor
                  </label>
                  <Badge variant="secondary" className="mt-1 opacity-50">
                    Your favorite
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Favorite Topping
                  </label>
                  <Badge variant="secondary" className="mt-1 opacity-50">
                    Your choice
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Favorite Brand
                  </label>
                  <Badge variant="secondary" className="mt-1 opacity-50">
                    Your brand
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Favorite Place
                  </label>
                  <Badge variant="secondary" className="mt-1 opacity-50">
                    Your spot
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary Preview */}
          <Card className="glass-effect md:col-span-2">
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-mint">0</div>
                  <div className="text-sm text-muted-foreground">
                    Predictions Made
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink">0</div>
                  <div className="text-sm text-muted-foreground">Days Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-mint">0</div>
                  <div className="text-sm text-muted-foreground">
                    Insights Viewed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink">New</div>
                  <div className="text-sm text-muted-foreground">Member Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center py-8">
          <Button size="lg" className="flex items-center mx-auto">
            <LogIn className="h-5 w-5 mr-2" />
            Sign In to Get Started
          </Button>
        </div>
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
