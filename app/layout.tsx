import type { Metadata } from "next";
import "./globals.css";
import { ModeProvider } from "@/components/mode-context";
import { OWNER_CONFIG } from "@/lib/owner";
import Script from "next/script";

export const metadata: Metadata = {
  title: `${OWNER_CONFIG.name} — ${OWNER_CONFIG.role}`,
  description: `Production system portfolio of ${OWNER_CONFIG.name}. Real-time request trace, career git log, postmortems, and service architectures.`,
  metadataBase: new URL(`https://${OWNER_CONFIG.domain}`),
  alternates: {
    canonical: `https://${OWNER_CONFIG.domain}`,
  },
  authors: [{ name: OWNER_CONFIG.name, url: `https://${OWNER_CONFIG.domain}` }],
  openGraph: {
    title: `${OWNER_CONFIG.name} — ${OWNER_CONFIG.role}`,
    description: "Production system portfolio: live request waterfall, career git log, services and postmortems.",
    url: `https://${OWNER_CONFIG.domain}`,
    siteName: OWNER_CONFIG.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${OWNER_CONFIG.name} — ${OWNER_CONFIG.role}`,
    description: "Production system portfolio: live request waterfall, career git log, services and postmortems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* View-source friendly note */}
        {/*
          * Hello, curious engineer!
          * You are inspecting the production source of ${OWNER_CONFIG.name}'s portfolio.
          * The repo is open source: ${OWNER_CONFIG.github}/portfolio
          * Notice: no trackers, no third-party scripts, zero raw IP logging, and real Server-Timing telemetry.
        */}
      </head>
      <body className="min-h-screen bg-canvas text-fg antialiased selection:bg-border-focus selection:text-white">
        <a href="#main-content" className="skip-link font-mono text-xs">
          Skip to main content [Enter]
        </a>
        <ModeProvider>
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </ModeProvider>
        {/* View source console greeting */}
        <Script id="devtools-greeting" strategy="afterInteractive">
          {`
            console.log(
              "%c[SYSTEM_INIT]%c Welcome to the production system portfolio of ${OWNER_CONFIG.name}.\\nExplore the source at ${OWNER_CONFIG.github} or try 'curl -sL https://${OWNER_CONFIG.domain}' from your terminal.",
              "color: #38bdf8; font-weight: bold; font-family: monospace;",
              "color: #8899b5; font-family: monospace;"
            );
          `}
        </Script>
      </body>
    </html>
  );
}
