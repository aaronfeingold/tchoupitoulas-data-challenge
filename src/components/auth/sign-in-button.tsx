"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Github, Chrome, LogIn } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SignInButtonProps {
  provider?: "google" | "github";
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

interface NavigateToSignInButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  children?: React.ReactNode;
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
      <Icon className="h-4 w-4 mr-2" />
      {config.label}
    </Button>
  );
}

export function NavigateToSignInButton({
  variant = "outline",
  size = "sm",
  className,
  children,
}: NavigateToSignInButtonProps) {
  const router = useRouter();

  const handleNavigateToSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleNavigateToSignIn}
            variant={variant}
            size={size}
            className={className}
          >
            {children || (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sign In</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function SignInOptions() {
  return (
    <div className="flex flex-col space-y-3">
      <SignInButton provider="google" className="hover-lift px-8 py-6" />
      <SignInButton
        provider="github"
        className="hover-lift px-8 py-6"
        variant="outline"
      />
    </div>
  );
}
