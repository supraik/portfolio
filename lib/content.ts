import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import { OWNER_CONFIG } from "./owner";

const contentDirectory = path.join(process.cwd(), "content");

// 1. Zod Schemas for frontmatter
export const ServiceFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  tagline: z.string(),
  status: z.enum(["operational", "degraded", "maintenance", "archived"]),
  uptime_30d: z.number().min(0).max(100),
  latency_p99: z.string(),
  qps: z.string(),
  github_url: z.string().url(),
  live_url: z.string().url().optional(),
  stack: z.array(z.string()),
  skills: z.array(z.string()),
  featured_order: z.number().default(99),
});
export type ServiceItem = z.infer<typeof ServiceFrontmatterSchema> & {
  content: string;
};

export const IncidentFrontmatterSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  severity: z.enum(["SEV-0", "SEV-1", "SEV-2"]),
  duration: z.string(),
  impact: z.string(),
  root_cause: z.string(),
  status: z.enum(["resolved", "mitigated", "investigating"]),
  services_affected: z.array(z.string()),
});
export type IncidentItem = z.infer<typeof IncidentFrontmatterSchema> & {
  slug: string;
  content: string;
};

export const RunbookFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  date: z.string(),
  read_time: z.string(),
  summary: z.string(),
  tags: z.array(z.string()),
});
export type RunbookItem = z.infer<typeof RunbookFrontmatterSchema> & {
  content: string;
};

export const ExperienceCommitSchema = z.object({
  hash: z.string(),
  role: z.string(),
  company: z.string(),
  period: z.string(),
  location: z.string(),
  branch: z.string().default("main"),
  message: z.string(),
  summary: z.string(),
  diff: z.object({
    additions: z.number(),
    deletions: z.number(),
    files_changed: z.number(),
  }),
  skills: z.array(z.string()),
  highlights: z.array(z.string()),
});
export type ExperienceCommitItem = z.infer<typeof ExperienceCommitSchema> & {
  slug: string;
  content: string;
};

// 2. Loaders
export function getAllServices(): ServiceItem[] {
  const dir = path.join(contentDirectory, "services");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  return files
    .map((filename) => {
      const fullPath = path.join(dir, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const parsed = ServiceFrontmatterSchema.parse(data);
      return { ...parsed, content };
    })
    .sort((a, b) => a.featured_order - b.featured_order);
}

export function getServiceBySlug(slug: string): ServiceItem | null {
  const services = getAllServices();
  return services.find((s) => s.slug === slug) || null;
}

export function getAllIncidents(): IncidentItem[] {
  const dir = path.join(contentDirectory, "incidents");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  return files
    .map((filename) => {
      const fullPath = path.join(dir, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const parsed = IncidentFrontmatterSchema.parse(data);
      const slug = filename.replace(/\.(mdx|md)$/, "");
      return { ...parsed, slug, content };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getIncidentBySlug(slug: string): IncidentItem | null {
  const incidents = getAllIncidents();
  return incidents.find((inc) => inc.slug === slug || inc.id.toLowerCase() === slug.toLowerCase()) || null;
}

export function getAllRunbooks(): RunbookItem[] {
  const dir = path.join(contentDirectory, "runbooks");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  return files
    .map((filename) => {
      const fullPath = path.join(dir, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const parsed = RunbookFrontmatterSchema.parse(data);
      return { ...parsed, content };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRunbookBySlug(slug: string): RunbookItem | null {
  const runbooks = getAllRunbooks();
  return runbooks.find((r) => r.slug === slug) || null;
}

export function getAllExperience(): ExperienceCommitItem[] {
  const dir = path.join(contentDirectory, "experience");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  return files
    .map((filename) => {
      const fullPath = path.join(dir, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const parsed = ExperienceCommitSchema.parse(data);
      const slug = filename.replace(/\.(mdx|md)$/, "");
      return { ...parsed, slug, content };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getUsesContent(): { content: string; updated: string } {
  const filePath = path.join(contentDirectory, "uses.mdx");
  if (!fs.existsSync(filePath)) {
    return { content: "Engineering setup documentation coming soon.", updated: "2026-11-20" };
  }
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  return { content, updated: (data.updated as string) || "2026-11-20" };
}

// 3. JSON Resume schema generator
export function generateResumeJson() {
  const experience = getAllExperience();
  const services = getAllServices();

  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: OWNER_CONFIG.name,
      label: OWNER_CONFIG.role,
      email: OWNER_CONFIG.email_public,
      url: `https://${OWNER_CONFIG.domain}`,
      summary: "Staff Systems & Full-Stack Engineer specializing in high-throughput distributed architectures, telemetry, and resilient production infrastructure.",
      location: {
        city: "Gurugram",
        countryCode: "IN",
        region: "Haryana",
      },
      profiles: [
        {
          network: "GitHub",
          username: OWNER_CONFIG.handle,
          url: OWNER_CONFIG.github,
        },
        {
          network: "LinkedIn",
          username: OWNER_CONFIG.handle,
          url: OWNER_CONFIG.linkedin,
        },
      ],
    },
    work: experience.map((exp) => ({
      name: exp.company,
      position: exp.role,
      startDate: exp.period.split("—")[0]?.trim() || exp.period,
      endDate: exp.period.includes("Present") ? "Present" : exp.period.split("—")[1]?.trim() || "",
      summary: exp.summary,
      highlights: exp.highlights,
    })),
    projects: services.map((srv) => ({
      name: srv.title,
      description: srv.tagline,
      highlights: [`p99 Latency: ${srv.latency_p99}`, `SLA Uptime: ${srv.uptime_30d}%`, `QPS: ${srv.qps}`],
      keywords: srv.stack,
      url: srv.github_url,
    })),
    skills: [
      {
        name: "Systems & Backend",
        keywords: ["Rust", "Go", "Distributed Systems", "Raft Consensus", "Kafka", "eBPF", "PostgreSQL"],
      },
      {
        name: "Observability & Infrastructure",
        keywords: ["OpenTelemetry", "Prometheus", "ClickHouse", "Docker", "Kubernetes", "Linux Kernel"],
      },
      {
        name: "Full-Stack Architecture",
        keywords: ["TypeScript", "Next.js", "Tailwind CSS", "Drizzle ORM", "REST / gRPC"],
      },
    ],
  };
}

export { generateCurlResume } from "./curl-resume";
