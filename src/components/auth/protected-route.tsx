"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { SignInOptions } from "./sign-in-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  fallback,
  requireAuth = true 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !session) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="container mx-auto max-w-md py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access this feature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInOptions />
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

export function AuthPrompt({ 
  title = "Sign in to unlock features",
  description = "Create an account to access enhanced analytics, ML predictions, and personalized content."
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInOptions />
      </CardContent>
    </Card>
  );
}