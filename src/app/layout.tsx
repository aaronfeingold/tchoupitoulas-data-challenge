import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";

export const metadata: Metadata = {
  title: "Tchoupitoulas Data Challenge",
  description:
    "A fun and interactive data analysis application for exploring hall of fame entries",
  keywords: ["data analysis", "dashboard", "ice cream", "hall of fame"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
