import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MeridianJourneyBar } from "@/components/MeridianJourneyBar";
import { MeridianTourGate } from "@/components/MeridianTourGate";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlexSlot — Orchestration ops énergie",
  description:
    "GridPulse dit quand · FlexSlot dit quoi faire · GreenOps enregistre l'action.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
    >
      <head>
        <Script
          id="flexslot-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='flexslot-theme',t=localStorage.getItem(k)||'light',r=document.documentElement;r.classList.remove('light','dark');if(t==='light'||t==='dark')r.classList.add(t);else r.classList.add('light');}catch(e){document.documentElement.classList.add('light');}})();`,
          }}
        />
      </head>
      <body className="app-canvas flex min-h-screen flex-col antialiased">
        <ThemeProvider>
          <SiteHeader />
          <MeridianJourneyBar current="flexslot" />
          <Suspense fallback={null}>
            <MeridianTourGate app="flexslot" />
          </Suspense>
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
