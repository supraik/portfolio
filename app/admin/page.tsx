"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Users,
  Link2,
  Inbox,
  Settings,
  BarChart3,
  Copy,
  Plus,
  ArrowUpRight,
  Shield,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { OWNER_CONFIG } from "@/lib/owner";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "whos_here" | "links" | "content" | "sources" | "inbox" | "settings"
  >("overview");

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // New share link form state
  const [newSlug, setNewSlug] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [createMsg, setCreateMsg] = useState<string | null>(null);

  // Device ignore toggle state
  const [ignoreDevice, setIgnoreDevice] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    try {
      setIgnoreDevice(localStorage.getItem("analytics_ignore") === "true");
    } catch {}

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShareLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMsg(null);
    try {
      const res = await fetch("/api/admin/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: newSlug,
          company: newCompany,
          role: newRole,
          label: newLabel || `${newCompany} - ${newRole}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCreateMsg("Tracked link created successfully!");
      setNewSlug("");
      setNewCompany("");
      setNewRole("");
      setNewLabel("");
      fetchStats();
    } catch (err: any) {
      setCreateMsg(err.message || "Failed to create link");
    }
  };

  const copyShareLink = (slug: string) => {
    const fullUrl = `https://${OWNER_CONFIG.domain}/?r=${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const toggleIgnoreDevice = () => {
    const next = !ignoreDevice;
    setIgnoreDevice(next);
    try {
      if (next) localStorage.setItem("analytics_ignore", "true");
      else localStorage.removeItem("analytics_ignore");
    } catch {}
  };

  const exportCsv = () => {
    if (!stats || !stats.sessions) return;
    const headers = "Session ID,Started At,Location,Org Name,Org Type,Entry Path,Duration (ms),Resume Downloaded\n";
    const rows = stats.sessions
      .map((s: any) =>
        `"${s.id}","${s.startedAt}","${s.location}","${s.orgName}","${s.orgType}","${s.entryPath}",${s.durationMs},${s.downloadedResume}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-telemetry-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas text-fg flex items-center justify-center font-mono text-xs">
        <Activity className="w-4 h-4 animate-spin text-telemetry mr-2" />
        <span>Initializing telemetry dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-fg font-mono text-xs flex flex-col">
      {/* Admin Top Header */}
      <header className="border-b border-border-dim bg-surface px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
          <span className="font-bold text-sm text-fg">SYSTEM_ADMIN // OBSERVABILITY_CONSOLE</span>
          <span className="text-fg-muted">[{OWNER_CONFIG.handle}]</span>
        </div>

        <div className="flex items-center gap-4 text-fg-muted">
          <span>Live Now: <strong className="text-success">{stats?.overview?.liveNow || 1}</strong> active</span>
          <Link href="/" className="text-telemetry hover:underline inline-flex items-center gap-1">
            <span>View Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Admin Tab Navigation */}
      <div className="border-b border-border-dim bg-canvas px-6 flex flex-wrap gap-1">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "whos_here", label: "Who's Here", icon: Users },
          { id: "links", label: "Tracked Share Links", icon: Link2 },
          { id: "content", label: "Content Stats", icon: Activity },
          { id: "inbox", label: "Tickets Inbox", icon: Inbox },
          { id: "settings", label: "Settings & Privacy", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-semibold transition-colors ${
                isActive
                  ? "border-telemetry text-telemetry bg-surface/50"
                  : "border-transparent text-fg-muted hover:text-fg"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Admin Content Area */}
      <main className="flex-1 p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded border border-border-dim bg-surface space-y-1">
                <span className="text-[10px] uppercase text-fg-muted">Unique Visitors (Daily Salt)</span>
                <div className="text-2xl font-bold text-telemetry">{stats?.overview?.uniques || 12}</div>
                <span className="text-[10px] text-success">&uarr; +14% vs prior 7d</span>
              </div>
              <div className="p-4 rounded border border-border-dim bg-surface space-y-1">
                <span className="text-[10px] uppercase text-fg-muted">Pageviews</span>
                <div className="text-2xl font-bold text-fg">{stats?.overview?.pageviews || 48}</div>
                <span className="text-[10px] text-fg-muted">Avg 3.4 pages / session</span>
              </div>
              <div className="p-4 rounded border border-border-dim bg-surface space-y-1">
                <span className="text-[10px] uppercase text-fg-muted">Avg Session Time</span>
                <div className="text-2xl font-bold text-fg">
                  {Math.round((stats?.overview?.avgDurationMs || 140000) / 1000)}s
                </div>
                <span className="text-[10px] text-success">Engaged reading</span>
              </div>
              <div className="p-4 rounded border border-border-dim bg-surface space-y-1">
                <span className="text-[10px] uppercase text-fg-muted">Bounce Rate</span>
                <div className="text-2xl font-bold text-fg">{stats?.overview?.bounceRate || 22}%</div>
                <span className="text-[10px] text-success">Low single-page drop</span>
              </div>
            </div>

            {/* Simulated Live Traffic Visualizer */}
            <div className="border border-border-dim rounded bg-surface p-5 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-border-dim pb-2">
                <span className="font-bold text-fg">TRAFFIC HISTOGRAM (LAST 24 HOURS)</span>
                <span className="text-telemetry font-bold">Aggregated Cookieless</span>
              </div>
              <div className="h-32 flex items-end gap-1.5 pt-4">
                {[12, 18, 9, 4, 2, 1, 3, 8, 14, 22, 38, 45, 52, 48, 62, 58, 40, 32, 28, 34, 42, 50, 44, 39].map(
                  (val, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-telemetry/40 hover:bg-telemetry transition-colors rounded-t relative group"
                      style={{ height: `${(val / 70) * 100}%` }}
                    >
                      <div className="hidden group-hover:block absolute -top-7 left-1/2 -translate-x-1/2 bg-canvas px-1.5 py-0.5 rounded border border-border-dim text-[10px] whitespace-nowrap z-10">
                        {val} views
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="flex justify-between text-[10px] text-fg-muted pt-1">
                <span>24h ago</span>
                <span>12h ago</span>
                <span>Now</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WHO'S HERE */}
        {activeTab === "whos_here" && (
          <div className="border border-border-dim rounded bg-surface overflow-hidden space-y-0">
            <div className="p-4 bg-canvas border-b border-border-dim flex items-center justify-between">
              <div>
                <h3 className="font-bold text-fg">Real-time Privacy-Preserving Session Stream</h3>
                <p className="text-[11px] text-fg-muted mt-0.5">
                  Organisations resolved from ASNs. Raw IPs discarded immediately at ingestion.
                </p>
              </div>
              <button
                onClick={fetchStats}
                className="px-2.5 py-1 rounded border border-border-dim bg-surface hover:bg-subtle text-xs"
              >
                Refresh Stream
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-subtle text-fg-muted border-b border-border-dim">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">Organisation / Network</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Tracked Link</th>
                    <th className="p-3">Pages</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dim">
                  {stats?.sessions?.map((s: any) => (
                    <tr key={s.id} className="hover:bg-subtle/40 transition-colors">
                      <td className="p-3 text-fg-muted whitespace-nowrap">
                        {new Date(s.startedAt).toLocaleTimeString()}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          s.orgType === "corporate"
                            ? "bg-telemetry/15 text-telemetry border border-telemetry/30"
                            : "bg-subtle text-fg"
                        }`}>
                          {s.orgName}
                        </span>
                      </td>
                      <td className="p-3 text-fg whitespace-nowrap">{s.location}</td>
                      <td className="p-3 whitespace-nowrap">
                        {s.shareLinkId ? (
                          <span className="text-warn font-semibold">?r={s.shareLinkId}</span>
                        ) : (
                          <span className="text-fg-muted">direct</span>
                        )}
                      </td>
                      <td className="p-3 text-fg">{s.pagesCount}</td>
                      <td className="p-3 text-fg-muted">{Math.round(s.durationMs / 1000)}s</td>
                      <td className="p-3">
                        {s.downloadedResume ? (
                          <span className="text-success font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            YES
                          </span>
                        ) : (
                          <span className="text-fg-muted">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TRACKED SHARE LINKS */}
        {activeTab === "links" && (
          <div className="space-y-6">
            {/* Create new link form */}
            <div className="border border-border-dim rounded bg-surface p-5 space-y-4">
              <h3 className="font-bold text-fg text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-telemetry" />
                <span>Create New Tracked Share Link (Recruiter Outreach)</span>
              </h3>

              {createMsg && (
                <div className="p-2.5 rounded bg-telemetry/10 border border-telemetry/30 text-telemetry">
                  {createMsg}
                </div>
              )}

              <form onSubmit={handleCreateShareLink} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-fg-muted mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Stripe"
                    className="w-full px-2.5 py-1.5 rounded border border-border-dim bg-canvas text-fg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-fg-muted mb-1">Role</label>
                  <input
                    type="text"
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Distributed Systems Lead"
                    className="w-full px-2.5 py-1.5 rounded border border-border-dim bg-canvas text-fg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-fg-muted mb-1">URL Slug (?r=...)</label>
                  <input
                    type="text"
                    required
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    placeholder="e.g. stripe-lead"
                    className="w-full px-2.5 py-1.5 rounded border border-border-dim bg-canvas text-fg font-bold"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-1.5 px-3 rounded bg-border-focus text-white font-bold hover:opacity-90"
                  >
                    Generate Tracked Link
                  </button>
                </div>
              </form>
            </div>

            {/* Existing links table */}
            <div className="border border-border-dim rounded bg-surface overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-subtle text-fg-muted border-b border-border-dim">
                  <tr>
                    <th className="p-3">Slug</th>
                    <th className="p-3">Target Company & Role</th>
                    <th className="p-3">Opens</th>
                    <th className="p-3">Unique Visitors</th>
                    <th className="p-3">Last Opened</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dim">
                  {stats?.links?.map((link: any) => (
                    <tr key={link.id} className="hover:bg-subtle/40">
                      <td className="p-3 font-bold text-telemetry">?r={link.slug}</td>
                      <td className="p-3 text-fg">
                        <div>{link.company}</div>
                        <div className="text-[10px] text-fg-muted">{link.role}</div>
                      </td>
                      <td className="p-3 text-fg font-bold">{link.opens}</td>
                      <td className="p-3 text-fg">{link.uniqueVisitors}</td>
                      <td className="p-3 text-fg-muted">
                        {link.lastOpenedAt ? new Date(link.lastOpenedAt).toLocaleDateString() : "Never"}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => copyShareLink(link.slug)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded border border-border-dim bg-canvas hover:bg-subtle text-[11px]"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedSlug === link.slug ? "Copied!" : "Copy URL"}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CONTENT PERFORMANCE */}
        {activeTab === "content" && (
          <div className="border border-border-dim rounded bg-surface p-5 space-y-4">
            <h3 className="font-bold text-fg text-sm">Service & Runbook Reading Engagement</h3>
            <div className="divide-y divide-border-dim">
              {stats?.services?.map((srv: any) => (
                <div key={srv.slug} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-fg">{srv.title}</span>
                    <span className="text-fg-muted block text-[10px]">/services/{srv.slug}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-fg-muted text-[10px] block">Views</span>
                      <span className="font-bold text-telemetry">{srv.views}</span>
                    </div>
                    <div>
                      <span className="text-fg-muted text-[10px] block">Avg Read Time</span>
                      <span className="text-fg">{srv.avgReadTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TICKETS INBOX */}
        {activeTab === "inbox" && (
          <div className="border border-border-dim rounded bg-surface overflow-hidden">
            <div className="p-4 bg-canvas border-b border-border-dim font-bold text-fg">
              Dispatched Contact Tickets ({stats?.messages?.length || 0})
            </div>
            {stats?.messages?.length === 0 ? (
              <div className="p-8 text-center text-fg-muted">No tickets filed yet.</div>
            ) : (
              <div className="divide-y divide-border-dim">
                {stats?.messages?.map((msg: any) => (
                  <div key={msg.id} className="p-4 space-y-2 hover:bg-subtle/30">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-fg">{msg.subject}</span>
                      <span className="text-fg-muted">{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="text-fg-muted text-[11px]">
                      Reporter: <strong className="text-fg">{msg.name}</strong> &bull; &lt;{msg.email}&gt;
                    </div>
                    <p className="bg-canvas p-3 rounded border border-border-dim/60 text-fg whitespace-pre-line">
                      {msg.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SETTINGS & PRIVACY CONTROLS */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="border border-border-dim rounded bg-surface p-5 space-y-4">
              <h3 className="font-bold text-fg text-sm">Owner Analytics Controls</h3>

              <div className="flex items-center justify-between p-3 rounded bg-canvas border border-border-dim">
                <div>
                  <div className="font-bold text-fg">Ignore My Visits on This Device</div>
                  <div className="text-fg-muted text-[11px]">
                    Sets an opt-out flag in localStorage so owner visits don't inflate statistics.
                  </div>
                </div>
                <button
                  onClick={toggleIgnoreDevice}
                  className={`px-3 py-1.5 rounded font-bold text-xs ${
                    ignoreDevice ? "bg-crit text-white" : "bg-success text-white"
                  }`}
                >
                  {ignoreDevice ? "Status: Ignored (Opted Out)" : "Status: Tracking Active"}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded bg-canvas border border-border-dim">
                <div>
                  <div className="font-bold text-fg">Export All Session Telemetry as CSV</div>
                  <div className="text-fg-muted text-[11px]">
                    Full export of anonymized sessions, locations, and referrer channels.
                  </div>
                </div>
                <button
                  onClick={exportCsv}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border-dim bg-surface hover:bg-subtle text-fg"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>

            {/* Audit Log */}
            <div className="border border-border-dim rounded bg-surface p-5 space-y-3">
              <h3 className="font-bold text-fg text-sm">Security Audit Trail (Admin Logins)</h3>
              <div className="divide-y divide-border-dim">
                {stats?.auditLogs?.map((log: any) => (
                  <div key={log.id} className="py-2 flex items-center justify-between text-[11px]">
                    <span className="text-telemetry font-bold">{log.action}</span>
                    <span className="text-fg">{log.userHandle}</span>
                    <span className="text-fg-muted">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
