"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Chrome, LogIn, Mail, Loader2 } from "lucide-react";
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
    router.push("/auth/sign-in");
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

export function EmailSignInForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setMessage({
          type: "error",
          text: "Failed to send magic link. Please try again.",
        });
      } else {
        setMessage({
          type: "success",
          text: "Magic link sent! Check your email and click the link to sign in.",
        });
        setEmail("");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleEmailSignIn} className="space-y-3">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="px-4 py-3"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !email}
          className="w-full hover-lift px-8 py-6"
          variant="outline"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending Magic Link...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              Continue with Email
            </>
          )}
        </Button>
      </form>

      {message && (
        <div
          className={`text-sm p-3 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}

export function SignInOptions() {
  const [showEmailForm, setShowEmailForm] = useState(false);

  return (
    <div className="space-y-4">
      {/* OAuth Providers */}
      <div className="flex flex-col space-y-3">
        <SignInButton provider="google" className="hover-lift px-8 py-6" />
        <SignInButton
          provider="github"
          className="hover-lift px-8 py-6"
          variant="outline"
        />
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* Email Option */}
      {showEmailForm ? (
        <EmailSignInForm />
      ) : (
        <Button
          onClick={() => setShowEmailForm(true)}
          variant="ghost"
          className="w-full hover-lift px-8 py-6"
        >
          <Mail className="h-4 w-4 mr-2" />
          Continue with Email
        </Button>
      )}

      {showEmailForm && (
        <div className="text-center">
          <Button
            onClick={() => setShowEmailForm(false)}
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Back to social sign-in
          </Button>
        </div>
      )}
    </div>
  );
}
