import "./global.css";
import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "./components/nav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "./components/footer";
import { RevealObserver, ScrollProgress } from "./components/motion";
import { baseUrl } from "./sitemap";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Manuel Martín Morante — Engineer & Researcher",
    template: "%s | Manuel Martín Morante",
  },
  description: "Software engineering, scientific computing, and a curiosity for mathematics and philosophy. Work and writing by Manuel Martín Morante.",
  openGraph: {
    title: "Manuel Martín Morante — Engineer & Researcher",
    description: "Building things. Questioning everything. Work and writing on computing, mathematics, and life.",
    images: [{ url: "/og" }],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  alternates: { types: { "application/rss+xml": "/rss" } },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cx(
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <body id="top">
        <ScrollProgress />
        <div className="backdrop" aria-hidden="true"><span /><span /><span /></div>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div className="site-shell">
          <Navbar />
          <main id="main-content" className="page-enter" tabIndex={-1}>{children}</main>
          <Footer />
        </div>
        <RevealObserver />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
