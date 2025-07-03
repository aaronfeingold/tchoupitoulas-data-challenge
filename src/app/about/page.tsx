"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IceCream, Users, Database, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-mint/5">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-6 leading-tight">
            About the Project
          </h1>
          <Image
            src="/Tchoup-Data-128x128.png"
            alt="Tchoup Data"
            width={128}
            height={128}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto object-contain mb-6"
          />
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Its Hot Out. Eat Ice Cream. Stay Cool. Support Local Ice Cream
            Shops.
          </p>
        </div>

        {/* About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="glass-effect hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center">
                <IceCream className="h-6 w-6 mr-2" />
                The Sweet Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                The Tchoupitoulas Data Challenge was born from a love of both
                data analysis and delicious ice cream. What started as a simple
                Hall of Fame tracking system has evolved into a comprehensive
                data exploration platform that makes analytics as enjoyable as
                your favorite sundae.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass-effect hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-6 w-6 mr-2" />
                Data-Driven Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Our platform transforms raw Hall of Fame data into meaningful
                insights through interactive visualizations, trend analysis, and
                user-friendly dashboards. Every scoop of data tells a story
                waiting to be discovered.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="glass-effect hover-lift">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Community Focused</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Built for the ice cream lovers to support a local institution.
                Track participation, celebrate achievements, and discover
                patterns in engagement.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass-effect hover-lift">
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Real-time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Watch trends emerge in real-time with our dynamic charts and
                interactive data visualizations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass-effect hover-lift">
            <CardHeader className="text-center">
              <IceCream className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>A Sweeter Future</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                We will soon have a predictive model to determine when and who
                will be the next to champion the challenge!
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Tchoup Sundae Image Section */}
        <div className="text-center mb-16">
          <Image
            src="/Tchoup-Sundae-128x128.png"
            alt="Tchoup Sundae"
            width={128}
            height={128}
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto object-contain hover-lift"
          />
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="glass-effect max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to explore?</CardTitle>
              <CardDescription>
                Dive into the data and discover the sweet insights waiting for
                you!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 rounded-md"
                >
                  Go Home
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 rounded-md"
                >
                  View Dashboard
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
