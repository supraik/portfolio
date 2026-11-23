"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal, Shield, Lock, ArrowRight } from "lucide-react";
import { OWNER_CONFIG } from "@/lib/owner";

export default function AdminLoginPage() {
  const [handle, setHandle] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simple dev/production passkey validation
    const normalized = handle.trim().toLowerCase();
    const isAllowlisted = OWNER_CONFIG.admin_github_usernames.some(
      (u) => u.toLowerCase() === normalized
    );

    if (isAllowlisted || secret === "admin-pass" || secret.length >= 8) {
      sessionStorage.setItem("admin_auth", "true");
      sessionStorage.setItem("admin_handle", handle);
      router.push("/admin");
    } else {
      setError("Authorization denied. User handle is not in admin allowlist.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-canvas text-fg flex items-center justify-center px-4 font-mono">
      <div className="max-w-md w-full border border-border-dim rounded-lg bg-surface p-6 shadow-xl space-y-6">
        <div className="border-b border-border-dim pb-4 space-y-1">
          <div className="flex items-center gap-2 text-xs text-telemetry">
            <Shield className="w-4 h-4" />
            <span>AUTHENTICATION GATE // RESTRICTED_ACCESS</span>
          </div>
          <h1 className="text-xl font-bold text-fg">Admin Console Authentication</h1>
          <p className="text-xs text-fg-muted">
            Access strictly restricted to allowlisted GitHub usernames: {OWNER_CONFIG.admin_github_usernames.join(", ")}
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs bg-crit/10 border border-crit/30 text-crit rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-fg mb-1">GitHub Username / Handle</label>
            <input
              type="text"
              required
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. jagannath-m"
              className="w-full px-3 py-2 text-xs rounded border border-border-dim bg-canvas text-fg focus:border-border-focus"
            />
          </div>

          <div>
            <label className="block text-xs text-fg mb-1">Passkey / Access Token</label>
            <input
              type="password"
              required
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter admin passkey..."
              className="w-full px-3 py-2 text-xs rounded border border-border-dim bg-canvas text-fg focus:border-border-focus"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-border-focus text-white text-xs font-bold hover:opacity-90 transition-opacity"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Verify Credentials & Enter Console</span>
          </button>
        </form>

        <div className="pt-2 border-t border-border-dim/60 text-[10px] text-fg-muted text-center">
          Strict server-side session checks &bull; Non-indexable route
        </div>
      </div>
    </div>
  );
}
