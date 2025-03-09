"use client";

export default function ClientLayout({ children, inter }) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="DigiNews" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/logo.jpg" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
}