"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface SignOutButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  showIcon?: boolean;
}

export function SignOutButton({
  variant = "ghost",
  size = "default",
  className,
  showIcon = true,
}: SignOutButtonProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <Button
      onClick={handleSignOut}
      variant={variant}
      size={size}
      className={className}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      Sign Out
    </Button>
  );
}
