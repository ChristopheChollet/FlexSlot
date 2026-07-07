import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
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
      className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteHeader />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
