"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Settings } from "lucide-react";

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const pathname = usePathname();

  const isProfilePage = pathname === "/profile";
  const isSettingsPage = pathname === "/profile/settings";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-mint/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <Button
              variant={isProfilePage ? "default" : "ghost"}
              size="sm"
              asChild
              className={`transition-colors ${
                isProfilePage
                  ? "bg-background text-foreground shadow-sm"
                  : "hover:bg-background/50"
              }`}
            >
              <Link href="/profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>
            <Button
              variant={isSettingsPage ? "default" : "ghost"}
              size="sm"
              asChild
              className={`transition-colors ${
                isSettingsPage
                  ? "bg-background text-foreground shadow-sm"
                  : "hover:bg-background/50"
              }`}
            >
              <Link href="/profile/settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}