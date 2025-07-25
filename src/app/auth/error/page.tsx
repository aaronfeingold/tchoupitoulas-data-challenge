"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

const errorMessages = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification link has expired or has already been used.",
  Default: "An error occurred during the authentication process.",
};

export default function AuthErrorPage() {
  const [isVisible, setIsVisible] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error") as keyof typeof errorMessages;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-mint/5 flex items-center justify-center">
      <div className="container mx-auto px-4 py-12">
        <div
          className={`transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Main Error Card */}
          <div className="max-w-md mx-auto">
            <Card className="glass-effect">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-red-600">Authentication Error</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {errorMessage}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <Button asChild className="w-full">
                    <Link href="/auth/sign-in">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/">
                      Return Home
                    </Link>
                  </Button>
                </div>
                
                {error === "Configuration" && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      If you&apos;re a developer, check your OAuth configuration and environment variables.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Help */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Still having trouble?{" "}
                <Link href="/about" className="text-primary hover:underline">
                  Contact support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}