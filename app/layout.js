import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"]
});

// إعدادات الـ metadata بدون viewport و themeColor
export const metadata = {
  metadataBase: new URL('https://rssfeed-frontend.vercel.app/'),
  title: {
    default: "DigiNews - Your Trusted Digital News Source",
    template: "%s | DigiNews"
  },
  description: "Your trusted source for digital news and updates, delivering real-time coverage of the latest stories and events",
  keywords: ["digital news", "news updates", "latest news", "breaking news", "real-time news"],
  authors: [{ name: "Digival" }],
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
    url: 'https://rssfeed-frontend.vercel.app/',
    siteName: 'DigiNews',
    title: 'DigiNews - Your Trusted Digital News Source',
    description: 'Your trusted source for digital news and updates, delivering real-time coverage of the latest stories and events',
    images: [
      {
        url: 'https://rssfeed-frontend.vercel.app/logo.jpg',
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
    images: ['https://rssfeed-frontend.vercel.app/twitter-image.jpg'],
    creator: '@diginews'
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    other: {
      me: ['https://rssfeed-frontend.vercel.app/logo.jpg']
    }
  }
};

// نقل الـ viewport و themeColor لـ generateViewport
export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: "#ffffff"
  };
}

import ClientLayout from "./client-layout";

export default function RootLayout({ children }) {
  return <ClientLayout inter={inter}>{children}<Toaster /></ClientLayout>;
}
