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
import { ImageCarousel } from "@/components/ui/image-carousel";
import { readdir } from "fs/promises";
import { join } from "path";

async function getTchoupitoulas_images() {
  try {
    const publicDir = join(process.cwd(), "public", "tchoup-data-challenge");
    const files = await readdir(publicDir);

    // Filter for image files only
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const imageFiles = files.filter((file) =>
      imageExtensions.some((ext) => file.toLowerCase().endsWith(ext)),
    );

    // Return the full paths for the public directory
    return imageFiles.map((file) => `/tchoup-data-challenge/${file}`);
  } catch (error) {
    console.error("Error reading tchoup-data-challenge directory:", error);
    return [];
  }
}

export default async function AboutPage() {
  const tchoupitoulas_images = await getTchoupitoulas_images();

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
                The{" "}
                <span className="text-gradient font-bold">Tchoupitoulas</span>{" "}
                Data <span className="text-gradient font-bold">Challenge</span>{" "}
                was born from a love of both{" "}
                <span className="font-bold text-primary"> data analysis</span>{" "}
                and{" "}
                <span className="font-bold text-primary">
                  delicious ice cream
                </span>
                . The purpose of this site is to provide a sortable and
                searchable view of the list of the{" "}
                <Link
                  href="https://creolecreamery.com/hall-of-fame/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium"
                >
                  Tchoupitoulas Challenge Hall of Famers
                </Link>
                : those who have completed the greatest ice cream eating
                challenge. Yet what started as a simple Hall of Fame tracking
                system has evolved into a{" "}
                <span className="font-bold text-primary">
                  comprehensive data exploration platform
                </span>{" "}
                that makes analytics as enjoyable as your favorite sundae.
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
                waiting to be discovered. The next time your friend says &quot;I
                did it 5 times and have the fastest time ever&quot;, you can
                check here to see if your friend is telling the truth.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Member Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              Member Benefits
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Sign in to unlock enhanced features and get the most out of your data exploration experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-effect hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2" />
                  Enhanced Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Access advanced data visualizations, personalized dashboards, and deeper insights into Hall of Fame trends. Track your favorite challengers and get notified of new records.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass-effect hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-6 w-6 mr-2" />
                  Personalized Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get customized data recommendations, save your favorite searches, and create personal data collections. Your preferences shape your unique analytics experience.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
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
                patterns in engagement. Who will be the next to complete the
                challenge? When will be the speed record be broken?
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

        {/* Tchoupitoulas Challenge Images Carousel */}
        <div className="text-center mb-16">
          {tchoupitoulas_images.length > 0 ? (
            <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
              <ImageCarousel
                images={tchoupitoulas_images}
                autoplayDelay={2500}
                alt="Tchoupitoulas Challenge"
                className="w-full"
                imageClassName="aspect-square object-cover"
                showPreviews={true}
              />
            </div>
          ) : (
            <div className="text-muted-foreground">
              <p>No challenge images available at the moment.</p>
            </div>
          )}
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
