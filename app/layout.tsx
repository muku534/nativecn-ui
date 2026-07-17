import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import { StudioProvider } from "@/lib/studio/context";

export const metadata: Metadata = {
  metadataBase: new URL('https://nativecn-ui.vercel.app'),
  title: {
    default: "nativecn-ui - Premium React Native Components",
    template: "%s | nativecn-ui"
  },
  description: "Copy-paste React Native UI components. Production-ready, TypeScript-first. No package bloat, just beautiful code.",
  keywords: ["React Native", "Components", "UI Library", "TypeScript", "Mobile Development", "Expo", "nativecn", "nativecn-ui"],
  authors: [{ name: "nativecn-ui" }],
  creator: "nativecn-ui",
  publisher: "nativecn-ui",
  category: "technology",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "nativecn-ui - Premium React Native Components",
    description: "Copy-paste React Native UI components. Production-ready, TypeScript-first.",
    url: 'https://nativecn-ui.vercel.app',
    siteName: 'nativecn-ui',
    type: "website",
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "nativecn-ui - Premium React Native Components",
    description: "Copy-paste React Native UI components. Production-ready, TypeScript-first.",
    creator: '@nativecn_ui',
  },
  icons: {
    icon: "/logo-v1.png",
    shortcut: "/logo-v1.png",
    apple: "/logo-v1.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        {/* Google Analytics 4 */}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StudioProvider>
            <AnalyticsProvider />
            {/* The Floating Navbar will be anchored here */}
            <Navbar />
            {/* Editorial Structural Grid */}
            <main className="min-h-screen relative mx-auto max-w-[1400px] border-x border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
              {children}
            </main>
            <Footer />
          </StudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
