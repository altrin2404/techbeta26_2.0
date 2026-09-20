import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageLoader } from "@/components/page-loader";
import { CookieConsent } from "@/components/cookie-consent";
import { Analytics } from "@/components/analytics";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  title: "TechBETA 2026 2.0 | St. Xavier's Catholic College of Engineering",
  description: "National Level Technical Symposium - October 13, 2026",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${orbitron.variable} h-full antialiased scroll-smooth scroll-pt-20 md:scroll-pt-28 overflow-x-hidden`}
    >
      <body className={`min-h-full flex flex-col bg-slate-950 text-cyan-50 font-[family-name:var(--font-inter)] overflow-x-hidden`}>
        <Analytics />
        <PageLoader />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
