"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Shield, Github, Chrome } from "lucide-react";

export function AccountSettings() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  
  // Determine provider icon
  const getProviderIcon = (provider: string) => {
    switch (provider?.toLowerCase()) {
      case "google":
        return <Chrome className="h-4 w-4" />;
      case "github":
        return <Github className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getProviderBadgeColor = (provider: string) => {
    switch (provider?.toLowerCase()) {
      case "google":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "github":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <div className="mt-1 p-3 bg-muted rounded-md">
                <span className="text-sm">{user.email}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Display Name</label>
              <div className="mt-1 p-3 bg-muted rounded-md">
                <span className="text-sm">{user.name || "Not set"}</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Account Provider</label>
            <div className="mt-2">
              <Badge 
                variant="secondary" 
                className={`${getProviderBadgeColor("google")} capitalize`}
              >
                {getProviderIcon("google")}
                <span className="ml-2">Google</span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Activity */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Account Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <div className="mt-1 p-3 bg-muted rounded-md">
                <span className="text-sm">Today</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Sign In</label>
              <div className="mt-1 p-3 bg-muted rounded-md">
                <span className="text-sm">Just now</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Account Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-mint">0</div>
                <div className="text-xs text-muted-foreground">Profile Updates</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-pink">0</div>
                <div className="text-xs text-muted-foreground">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-mint">1</div>
                <div className="text-xs text-muted-foreground">Connected Accounts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-pink">New</div>
                <div className="text-xs text-muted-foreground">Status</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1">
              <Shield className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="flex-1" disabled>
              <Mail className="h-4 w-4 mr-2" />
              Verify Email
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Connected accounts are managed through your OAuth provider. 
              To update your email or password, please visit your Google account settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}