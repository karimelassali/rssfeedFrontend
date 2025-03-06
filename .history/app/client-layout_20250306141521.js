"use client";

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function ClientLayout({ children, inter }) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="DigiNews" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <header className="fixed top-4 left-4 z-50">
          <Link href="/">
            <Button variant="outline" size="icon" className="bg-white hover:bg-gray-100 shadow-md">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Button>
          </Link>
        </header>
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
}