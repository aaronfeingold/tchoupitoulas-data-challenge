"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Download,
  Trash2,
  AlertTriangle,
  FileText,
  Lock,
  Eye,
  Database,
} from "lucide-react";
import { toast } from "sonner";
import { deleteUserAccount, exportUserData } from "@/actions";

export function PrivacySettings() {
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);

    try {
      const userData = await exportUserData();

      // Check if the export was successful
      if (!userData.success) {
        toast.error(userData.error || "Failed to export user data");
        return;
      }

      // Use real data from the database
      const realUserData = userData.data;

      // Create and download file
      const dataStr = JSON.stringify(realUserData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `fest-vibes-ai-user-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("User data exported successfully!");
    } catch (error) {
      toast.error("Failed to export user data");
      console.error("Data export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm account deletion");
      return;
    }

    setIsDeleting(true);

    try {
      // TODO: Implement server action for account deletion
      await deleteUserAccount();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        "Account deletion initiated. You will be signed out shortly."
      );

      // In real implementation, this would sign out the user and redirect
      setTimeout(() => {
        // signOut({ callbackUrl: "/" });
      }, 2000);
    } catch (error) {
      toast.error("Failed to delete account. Please try again.");
      console.error("Account deletion error:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmText("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Privacy */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Data Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <Database className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Data Collection</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  We collect only essential profile information and preferences
                </p>
                <Badge variant="outline" className="mt-2 text-xs">
                  Minimal
                </Badge>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <Lock className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Data Security</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  All data is encrypted and stored securely
                </p>
                <Badge variant="outline" className="mt-2 text-xs">
                  Encrypted
                </Badge>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <Eye className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Data Sharing</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  We never share your personal data with third parties
                </p>
                <Badge variant="outline" className="mt-2 text-xs">
                  Private
                </Badge>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <FileText className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Data Usage</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Used only to enhance your experience on our platform
                </p>
                <Badge variant="outline" className="mt-2 text-xs">
                  Purposeful
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export Your Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Download a complete copy of your personal data, including profile
            information, preferences, and account activity. This data will be
            provided in JSON format.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              What&apos;s included in your data export:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Profile information (name, email, location, preferences)
              </li>
              <li>• Ice cream preferences and avatar selection</li>
              <li>• Account activity and session history</li>
              <li>• Notification preferences and settings</li>
            </ul>
          </div>

          <Button
            onClick={handleExportData}
            disabled={isExporting}
            className="w-full md:w-auto"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Preparing Export...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card className="glass-effect border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700">
            <Trash2 className="h-5 w-5 mr-2" />
            Delete Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium">
                  Warning: This action cannot be undone
                </p>
                <p className="mt-1">
                  Deleting your account will permanently remove all your data,
                  including:
                </p>
                <ul className="mt-2 ml-4 list-disc space-y-1">
                  <li>Profile information and preferences</li>
                  <li>Account activity and history</li>
                  <li>Any saved settings or configurations</li>
                  <li>All associated authentication data</li>
                </ul>
              </div>
            </div>
          </div>

          {!showDeleteConfirm ? (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full md:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete My Account
            </Button>
          ) : (
            <div className="space-y-4 p-4 border-2 border-red-200 rounded-lg bg-red-50">
              <p className="text-sm font-medium text-red-800">
                To confirm account deletion, please type <strong>DELETE</strong>{" "}
                below:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="flex space-x-3">
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "DELETE" || isDeleting}
                  className="flex-1"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Confirm Delete
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                  }}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
