"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInOptions } from "@/components/auth/sign-in-button";

export default function SignInPage() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Redirect if already signed in
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-mint/5">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="/Tchoup-Dance.gif"
            alt="Loading..."
            width={128}
            height={128}
            className="object-contain"
            unoptimized
          />
          <p className="text-sm md:text-lg font-medium text-muted-foreground animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (session) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-mint/5 flex items-center justify-center">
      <div className="container mx-auto px-4 py-12">
        <div
          className={`transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Main Sign In Card */}
          <div className="max-w-md mx-auto">
            <Card className="glass-effect">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto">
                  <Image
                    src="/Tchoup-Data-128x128.png"
                    alt="Tchoupitoulas Data Challenge"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">
                    Welcome to Tchoupitoulas Data Challenge
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Sign in to access enhanced features, analytics, and
                    personalized insights
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <SignInOptions />

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    By signing in, you agree to explore the sweetest data
                    analysis experience!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                New to the project?{" "}
                <Link href="/about" className="text-primary hover:underline">
                  Learn more about the Tchoupitoulas Data Challenge
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
