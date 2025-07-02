import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tchoupitoulas Data Challenge",
  description:
    "A fun and interactive data analysis application for exploring hall of fame entries",
  keywords: ["data analysis", "dashboard", "ice cream", "hall of fame"],
  openGraph: {
    title: "Tchoupitoulas Data Challenge",
    description:
      "A fun and interactive data analysis application for exploring hall of fame entries",
    url: "https://tchoupitoulas-data-challenge.vercel.app",
    siteName: "Tchoupitoulas Data Challenge",
    images: [
      {
        url: "/favicon.ico",
        width: 128,
        height: 128,
        alt: "Tchoupitoulas Data Challenge - A fun and interactive data analysis application for exploring hall of fame entries",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tchoupitoulas Data Challenge",
    description:
      "A fun and interactive data analysis application for exploring hall of fame entries",
    images: ["/favicon.ico"],
  },
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "128x128",
      url: "/favicon.ico",
    },
    {
      rel: "shortcut icon",
      url: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      url: "/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/png" />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
