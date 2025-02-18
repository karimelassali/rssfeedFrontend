"use client";

import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <main className="min-h-screen bg-gray-50">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
