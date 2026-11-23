import { NextResponse } from "next/server";
import { generateResumeJson } from "@/lib/content";

export const dynamic = "force-static";

export async function GET() {
  const resume = generateResumeJson();
  // Printable clean HTML formatted for print-to-PDF / PDF downloaders
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${resume.basics.name} — Résumé</title>
  <style>
    @page { size: A4; margin: 18mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111827; line-height: 1.45; font-size: 13px; margin: 0; padding: 24px; }
    h1 { font-size: 24px; margin: 0 0 4px; }
    .subtitle { font-size: 14px; color: #4b5563; margin-bottom: 12px; }
    .contact { font-size: 12px; color: #6b7280; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; }
    h2 { font-size: 15px; border-bottom: 1px solid #d1d5db; padding-bottom: 3px; margin-top: 18px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #1f2937; }
    .item { margin-bottom: 14px; }
    .item-header { display: flex; justify-content: space-between; font-weight: 600; font-size: 13px; }
    .item-sub { color: #4b5563; font-style: italic; margin-bottom: 4px; font-size: 12px; }
    ul { margin: 4px 0 0 18px; padding: 0; }
    li { margin-bottom: 3px; }
    .skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 12px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>${resume.basics.name}</h1>
  <div class="subtitle">${resume.basics.label} — ${resume.basics.location.city}, ${resume.basics.location.region}</div>
  <div class="contact">
    ${resume.basics.email} &bull; ${resume.basics.url} &bull; ${resume.basics.profiles.map(p => p.url).join(" &bull; ")}
  </div>

  <h2>Summary</h2>
  <p>${resume.basics.summary}</p>

  <h2>Career Commit History</h2>
  ${resume.work.map(w => `
    <div class="item">
      <div class="item-header"><span>${w.position} &bull; ${w.name}</span><span>${w.startDate} &mdash; ${w.endDate}</span></div>
      <div class="item-sub">${w.summary}</div>
      <ul>
        ${w.highlights.map(h => `<li>${h}</li>`).join("")}
      </ul>
    </div>
  `).join("")}

  <h2>Key Production Services</h2>
  ${resume.projects.map(p => `
    <div class="item">
      <div class="item-header"><span>${p.name}</span><span>${p.keywords.join(", ")}</span></div>
      <div class="item-sub">${p.description}</div>
      <ul>
        ${p.highlights.map(h => `<li>${h}</li>`).join("")}
      </ul>
    </div>
  `).join("")}

  <h2>Technical Competencies</h2>
  <div class="skills-grid">
    ${resume.skills.map(s => `
      <div><strong>${s.name}:</strong><br/>${s.keywords.join(", ")}</div>
    `).join("")}
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": 'inline; filename="resume.html"',
      "Cache-Control": "public, max-age=86400",
    },
  });
}
