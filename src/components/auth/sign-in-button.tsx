"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github, Chrome } from "lucide-react";

interface SignInButtonProps {
  provider?: "google" | "github";
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

const providerConfig = {
  google: {
    icon: Chrome,
    label: "Continue with Google",
    id: "google",
  },
  github: {
    icon: Github,
    label: "Continue with GitHub",
    id: "github",
  },
};

export function SignInButton({
  provider = "google",
  variant = "default",
  size = "default",
  className,
}: SignInButtonProps) {
  const config = providerConfig[provider];
  const Icon = config.icon;

  const handleSignIn = () => {
    signIn(config.id, { callbackUrl: "/dashboard" });
  };

  return (
    <Button
      onClick={handleSignIn}
      variant={variant}
      size={size}
      className={className}
    >
      <Icon className="mr-2 h-4 w-4" />
      {config.label}
    </Button>
  );
}

export function SignInOptions() {
  return (
    <div className="space-y-3">
      <SignInButton provider="google" />
      <SignInButton provider="github" variant="outline" />
    </div>
  );
}
