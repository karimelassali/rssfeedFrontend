"use client";

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children, inter }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

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
        {!isHomePage && (
          <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm py-2 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <Link href="/">
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Home</span>
                </Button>
              </Link>
            </div>
          </header>
        )}
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
}