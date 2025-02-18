"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/config/supertokens-client";
import { SuperTokensProvider } from "supertokens-auth-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DigiNews",
  description: "News Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SuperTokensProvider>
          {children}
        </SuperTokensProvider>
      </body>
    </html>
  );
}
