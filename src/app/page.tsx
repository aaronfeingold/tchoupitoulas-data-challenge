import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Database, Users, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-mint/5">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gradient mb-6">
            Tchoupitoulas Data Challenge
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            🍦 Welcome to the sweetest data analysis experience! Explore our
            Hall of Fame entries with beautiful visualizations and interactive
            dashboards.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="hover-lift text-lg px-8 py-6">
              Explore the Dashboard 📊
            </Button>
          </Link>
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
                Browse through all Hall of Fame entries with powerful filtering
                and search capabilities.
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

        {/* Call to Action */}
        <div className="text-center">
          <Card className="glass-effect max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to dive in?</CardTitle>
              <CardDescription>
                Start exploring the Hall of Fame data and discover amazing
                insights!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="hover-lift">
                  Launch Dashboard 🚀
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
