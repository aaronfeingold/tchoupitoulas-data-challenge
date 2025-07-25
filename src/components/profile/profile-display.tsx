"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAvatarComponent } from "@/components/avatars/ice-cream-avatars";
import { Mail, MapPin, IceCream } from "lucide-react";
import { User } from "@/lib/schema";

interface ProfileDisplayProps {
  profileData?: User | null;
}

export const ProfileDisplay = React.memo(function ProfileDisplay({
  profileData,
}: ProfileDisplayProps) {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const user = session.user;

  // Get ice cream avatar component - use profileData if available
  const avatarSelection = profileData?.avatarSelection ?? 0;
  const avatarData = getAvatarComponent(avatarSelection);
  const Avatar = avatarData.component;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Basic Information */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mint to-pink p-2 flex items-center justify-center">
                <Avatar size={48} />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {user.name || "Anonymous User"}
                </h3>
                <p className="text-muted-foreground">Hall of Fame Explorer</p>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {profileData?.location || "Not specified"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Ice Cream Preferences */}
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
              <Badge variant="secondary" className="mt-1">
                {profileData?.favoriteIceCreamFlavor || "Not specified"}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Favorite Topping
              </label>
              <Badge variant="secondary" className="mt-1">
                {profileData?.favoriteTopping || "Not specified"}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Favorite Brand
              </label>
              <Badge variant="secondary" className="mt-1">
                {profileData?.favoriteBrand || "Not specified"}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Favorite Place
              </label>
              <Badge variant="secondary" className="mt-1">
                {profileData?.favoritePlace || "Not specified"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
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
  );
});

ProfileDisplay.displayName = "ProfileDisplay";
