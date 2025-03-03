import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"]
});

export const metadata = {
  metadataBase: new URL('https://rssfeed-frontend.vercel.app/'),
  title: {
    default: "DigiNews - Your Trusted Digital News Source",
    template: "%s | DigiNews"
  },
  description: "Your trusted source for digital news and updates, delivering real-time coverage of the latest stories and events",
  keywords: ["digital news", "news updates", "latest news", "breaking news", "real-time news"],
  authors: [{ name: "DigiNews Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#ffffff",
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rssfeed-frontend.vercel.app/og-image.jpg',
    siteName: 'DigiNews',
    title: 'DigiNews - Your Trusted Digital News Source',
    description: 'Your trusted source for digital news and updates, delivering real-time coverage of the latest stories and events',
    images: [
      {
        url: 'https://diginews.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DigiNews - Digital News Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DigiNews - Your Trusted Digital News Source',
    description: 'Your trusted source for digital news and updates, delivering real-time coverage of the latest stories and events',
    images: ['https://diginews.com/twitter-image.jpg'],
    creator: '@diginews'
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    other: {
      me: ['https://rssfeed-frontend.vercel.app/og-image.jpg']
    }
  }
};

import ClientLayout from "./client-layout";

export default function RootLayout({ children }) {
  return <ClientLayout inter={inter}>{children}<Toaster /></ClientLayout>;
}
