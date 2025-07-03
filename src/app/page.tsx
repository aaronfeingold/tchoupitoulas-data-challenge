"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  Database,
  Users,
  TrendingUp,
  Rocket,
  IceCream,
} from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDashboardNavigation = async () => {
    setIsLoading(true);

    // Set flag to indicate we're navigating to dashboard
    sessionStorage.setItem("dashboard-navigation", "true");

    // Wait for at least 3 seconds to show the loading.gif
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Navigate to dashboard
    router.push("/dashboard");
  };

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/loading.gif"
              alt="Loading..."
              width={128}
              height={128}
              className="w-32 h-32 object-contain"
            />
            <p className="text-sm md:text-lg font-medium text-muted-foreground animate-pulse">
              Preparing your sweet and tasty dashboard...
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-mint/5">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-6 leading-tight">
              Tchoupitoulas Data Challenge
            </h1>
            <Image
              src="/Tchoup-Data-128x128.png"
              alt="Tchoup Data"
              width={128}
              height={128}
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto object-contain mb-6"
            />
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Welcome to the sweetest data analysis experience! Explore the Hall
              of Fame entries with beautiful visualizations and interactive
              dashboards.
            </p>
            <Button
              size="lg"
              className="hover-lift text-lg px-8 py-6"
              onClick={handleDashboardNavigation}
              disabled={isLoading}
            >
              Explore the Dashboard <IceCream className="h-4 w-4 mr-2" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="glass-effect hover-lift">
              <CardHeader className="text-center">
                <Database className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Data Explorer</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Browse through all Hall of Fame entries with powerful
                  filtering and search capabilities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass-effect hover-lift">
              <CardHeader className="text-center">
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Discover trends and patterns with interactive charts and
                  visualizations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass-effect hover-lift">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Learn about participation patterns, streaks, and most active
                  contributors.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass-effect hover-lift">
              <CardHeader className="text-center">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Track growth over time and identify seasonal patterns in the
                  data.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Tchoup Data Image Section */}
          <div className="text-center mb-16">
            <Image
              src="/Tchoup-Data-128x128.png"
              alt="Tchoup Data"
              width={128}
              height={128}
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto object-contain hover-lift"
            />
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="glass-effect max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Ready to dive in?</CardTitle>
                <CardDescription>
                  Start exploring the Hall of Fame data and discover delicious
                  insights!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  variant="outline"
                  className="hover-lift"
                  onClick={handleDashboardNavigation}
                  disabled={isLoading}
                >
                  Launch Dashboard <Rocket className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
