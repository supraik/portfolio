"use client";

import React, { useState, useEffect } from "react";
import { Send, CheckCircle2, AlertCircle, LifeBuoy, Clock } from "lucide-react";
import { OWNER_CONFIG } from "@/lib/owner";

export function TicketForm() {
  const [mountedAt] = useState<number>(Date.now());
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [severity, setSeverity] = useState<"low" | "normal" | "high" | "urgent">("normal");
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Bot honeypot

  const [submitting, setSubmitting] = useState(false);
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Spam honeypot check
    if (honeypot) {
      setErrorMessage("Automated submission flagged by spam protection.");
      return;
    }

    // Time-to-submit check (< 2s indicates bot)
    if (Date.now() - mountedAt < 2000) {
      setErrorMessage("Form completed too quickly. Please take a moment to review before sending.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: title,
          body,
          severity,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to file ticket. Please try again or email directly.");
      }

      setSuccessTicketId(data.ticketId || "TICK-" + Math.floor(1000 + Math.random() * 9000));
      setTitle("");
      setBody("");
      setEmail("");
      setName("");
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while transmitting the ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="space-y-6">
      <div className="border-b border-border-dim pb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-telemetry mb-1">
          <LifeBuoy className="w-4 h-4" />
          <span>INGRESS // DISPATCH_TICKET</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-fg">Open a Production Ticket (Contact)</h2>
        <p className="text-xs font-mono text-fg-muted mt-1">
          Whether you want to discuss distributed systems architecture, hiring, or collaboration, file a ticket below. Or send email to <a href={`mailto:${OWNER_CONFIG.email_public}`} className="text-telemetry underline">{OWNER_CONFIG.email_public}</a>.
        </p>
      </div>

      <div className="border border-border-dim rounded bg-surface p-6 shadow-sm">
        {successTicketId ? (
          <div className="p-6 text-center space-y-4 font-mono">
            <div className="w-12 h-12 rounded-full bg-success/20 text-success mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-fg">Ticket Filed Successfully</h3>
            <p className="text-xs text-fg-muted max-w-md mx-auto">
              Your ticket <span className="text-telemetry font-bold">[{successTicketId}]</span> has been dispatched to {OWNER_CONFIG.name}. Expect an asynchronous response within 24 business hours.
            </p>
            <button
              onClick={() => setSuccessTicketId(null)}
              className="px-4 py-2 text-xs border border-border-dim rounded bg-canvas hover:bg-subtle text-fg"
            >
              File another ticket
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 text-xs font-mono bg-crit/10 border border-crit/30 text-crit rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Hidden honeypot field for bot trapping */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website_hp">Leave empty</label>
              <input
                id="website_hp"
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-fg mb-1">
                  Reporter Name <span className="text-crit">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-3 py-2 text-xs font-mono rounded border border-border-dim bg-canvas text-fg focus:border-border-focus"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-fg mb-1">
                  Email Address <span className="text-crit">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jane@acme.corp"
                  className="w-full px-3 py-2 text-xs font-mono rounded border border-border-dim bg-canvas text-fg focus:border-border-focus"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-fg mb-1">
                  Issue Title / Subject <span className="text-crit">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus Architect Role at Acme"
                  className="w-full px-3 py-2 text-xs font-mono rounded border border-border-dim bg-canvas text-fg focus:border-border-focus"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-fg mb-1">
                  Severity SLA
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-mono rounded border border-border-dim bg-canvas text-fg focus:border-border-focus"
                >
                  <option value="low">Low (General Query)</option>
                  <option value="normal">Normal (Project Discussion)</option>
                  <option value="high">High (Active Hiring / Senior Role)</option>
                  <option value="urgent">Urgent (Production Fire / P0)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-fg mb-1">
                Ticket Description / Message Body <span className="text-crit">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Provide details on project context, team objectives, or collaboration timeline..."
                className="w-full px-3 py-2 text-xs font-mono rounded border border-border-dim bg-canvas text-fg focus:border-border-focus leading-relaxed"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="text-[11px] font-mono text-fg-muted flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Rate limited to 3 tickets/hour per client hash. Zero third-party trackers.</span>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold rounded bg-border-focus text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? "Transmitting ticket..." : "Dispatch ticket"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
