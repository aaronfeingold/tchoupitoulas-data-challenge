import { Suspense } from "react";
import { IceCream } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-mint/5">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-3 leading-tight">
                Tchoupitoulas Data Challenge
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl lg:text-2xl flex items-center">
                <IceCream className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 mr-2 flex-shrink-0" />
                Sweet insights from our Hall of Fame entries
              </p>
            </div>
          </div>
        </header>

        <Suspense
          fallback={
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
    </div>
  );
}
