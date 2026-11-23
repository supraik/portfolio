import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { OWNER_CONFIG } from "@/lib/owner";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const slugPath = params.slug?.join("/") || "system";
  const title = slugPath.replace(/[-_]/g, " ").toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0e131f",
          padding: "60px 80px",
          fontFamily: "monospace",
          border: "4px solid #24304e",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", color: "#38bdf8", fontSize: "24px" }}>
            [LIVE_SYSTEM] // {OWNER_CONFIG.domain}
          </div>
          <div style={{ color: "#34d399", fontSize: "20px" }}>STATUS: OPERATIONAL</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ color: "#8899b5", fontSize: "20px" }}>TELEMETRY & ARCHITECTURE SPEC</div>
          <div style={{ color: "#ffffff", fontSize: "48px", fontWeight: "bold" }}>
            {title}
          </div>
          <div style={{ color: "#8899b5", fontSize: "22px" }}>
            {OWNER_CONFIG.name} &bull; {OWNER_CONFIG.role}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #24304e",
            paddingTop: "20px",
            color: "#8899b5",
            fontSize: "18px",
          }}
        >
          <span>Consensus &bull; Real-time Telemetry &bull; Zero-Downtime</span>
          <span style={{ color: "#38bdf8" }}>p99 &lt; 15ms</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
