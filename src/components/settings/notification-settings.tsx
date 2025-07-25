"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleNotifications = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Implement server action for toggling notifications
      // await toggleEmailNotifications(!emailNotifications);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmailNotifications(!emailNotifications);
      toast.success(
        emailNotifications 
          ? "Email notifications disabled" 
          : "Email notifications enabled"
      );
    } catch (error) {
      toast.error("Failed to update notification settings");
      console.error("Notification toggle error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Newsletter Subscription</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Get notified when new Hall of Fame entries are added. 
                  Receive daily digests with the latest achievements and records.
                </p>
                <Badge 
                  variant="secondary" 
                  className="mt-2 bg-orange-100 text-orange-800"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Coming Soon
                </Badge>
              </div>
            </div>
            <Button
              variant={emailNotifications ? "default" : "outline"}
              onClick={handleToggleNotifications}
              disabled={isLoading || true} // Disabled until email system is implemented
              className="min-w-20"
            >
              {emailNotifications ? "On" : "Off"}
            </Button>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Email System Coming Soon</p>
                <p className="mt-1">
                  We're working on implementing a comprehensive email notification system. 
                  This feature will be available in a future update and will include:
                </p>
                <ul className="mt-2 ml-4 list-disc space-y-1">
                  <li>Daily digest emails with new Hall of Fame entries</li>
                  <li>Weekly summaries and streak analysis</li>
                  <li>Personalized insights and recommendations</li>
                  <li>Record-breaking notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
              <div>
                <span className="font-medium text-sm">Browser Notifications</span>
                <p className="text-xs text-muted-foreground">In-app notifications and alerts</p>
              </div>
              <Badge variant="outline">Enabled</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
              <div>
                <span className="font-medium text-sm">Success Messages</span>
                <p className="text-xs text-muted-foreground">Confirmation toasts and feedback</p>
              </div>
              <Badge variant="outline">Enabled</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
              <div>
                <span className="font-medium text-sm">Error Alerts</span>
                <p className="text-xs text-muted-foreground">Important error messages and warnings</p>
              </div>
              <Badge variant="outline">Enabled</Badge>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Browser-based notifications are currently active and help provide 
              immediate feedback for your actions within the application.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Email Verification Status */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <span className="font-medium">Email Verified</span>
                <p className="text-sm text-muted-foreground">
                  Your email address is verified through your OAuth provider
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}