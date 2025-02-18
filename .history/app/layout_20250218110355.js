import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DigiNews",
  description: "Your trusted source for digital news and updates",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#ffffff",
  manifest: "/manifest.json",
};

import ClientLayout from "./client-layout";

export default function RootLayout({ children }) {
  return <ClientLayout inter={inter}>{children}</ClientLayout>;
}
