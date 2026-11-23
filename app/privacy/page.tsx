import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { StatusBar } from "@/components/status-bar";
import { CommandPalette } from "@/components/command-palette";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { OWNER_CONFIG } from "@/lib/owner";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-canvas text-fg">
      <Navbar />
      <CommandPalette />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-telemetry hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&larr; Back to Portfolio</span>
        </Link>

        <div className="border border-border-dim rounded bg-surface p-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-success">
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4" />
              PRIVACY_SPEC // COMPLIANCE_STATEMENT
            </span>
            <span className="text-fg-muted">GDPR & India DPDP Act 2023 Compliant</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-fg">
            Privacy Policy & Telemetry Architecture
          </h1>
          <p className="text-sm text-fg-muted leading-relaxed">
            This portfolio operates under a strict privacy-first covenant. Here is exactly what is collected, why, how long it is kept, and how to request deletion.
          </p>
        </div>

        <div className="border border-border-dim rounded bg-surface p-6 space-y-6 text-sm text-fg leading-relaxed max-w-prose font-sans">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-fg font-mono uppercase text-telemetry">
              1. Zero Raw IP Storage
            </h2>
            <p className="text-fg-muted">
              We never store your raw IP address on disk, in database tables, or in application logs. At request ingestion, the IP is read into memory strictly to look up coarse geography (Country, Region, City) and ASN organization type (e.g. corporate network vs residential ISP). The raw IP is immediately wiped from memory.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-fg font-mono uppercase text-telemetry">
              2. Plausible-Style Daily Rotating Salt
            </h2>
            <p className="text-fg-muted">
              Unique visitor counts are computed as:
              <br />
              <code className="text-xs font-mono bg-canvas px-2 py-1 rounded block my-1 border border-border-dim">
                SHA256(daily_rotating_salt + truncated_ip + user_agent + domain)
              </code>
              The salt rotates every 24 hours. Historical salts are permanently deleted, making cross-day tracking cryptographically impossible.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-fg font-mono uppercase text-telemetry">
              3. Cookieless & No Third-Party Trackers
            </h2>
            <p className="text-fg-muted">
              No tracking cookies, Google Analytics, or third-party ad pixels are loaded anywhere on this site. Fonts are self-hosted. All tracker scripts are first-party and served from this domain.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-fg font-mono uppercase text-telemetry">
              4. Data Retention & Deletion Requests
            </h2>
            <p className="text-fg-muted">
              Raw telemetry records are pruned after 90 days, rolled up into aggregate statistics, and deleted. To request deletion of any message or guestbook entry you submitted, send an email to <a href={`mailto:${OWNER_CONFIG.email_public}`} className="text-telemetry underline">{OWNER_CONFIG.email_public}</a> and it will be deleted within 48 hours.
            </p>
          </section>
        </div>
      </main>

      <StatusBar />
    </div>
  );
}
