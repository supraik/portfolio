import { describe, it, expect } from "vitest";
import {
  getAllServices,
  getServiceBySlug,
  getAllIncidents,
  getIncidentBySlug,
  getAllRunbooks,
  getAllExperience,
  generateResumeJson,
  generateCurlResume,
  ServiceFrontmatterSchema,
  IncidentFrontmatterSchema,
} from "../../lib/content";

describe("Content Layer & MDX Schemas", () => {
  it("loads and parses services with valid frontmatter", () => {
    const services = getAllServices();
    expect(services.length).toBeGreaterThanOrEqual(2);
    const kv = services.find((s) => s.slug === "distributed-kv");
    expect(kv).toBeDefined();
    expect(kv?.status).toBe("operational");
    expect(kv?.uptime_30d).toBe(99.98);
    expect(kv?.stack).toContain("Rust");
  });

  it("retrieves a service by slug", () => {
    const service = getServiceBySlug("distributed-kv");
    expect(service).not.toBeNull();
    expect(service?.title).toContain("HydraKV");
  });

  it("loads incidents and orders them by date descending", () => {
    const incidents = getAllIncidents();
    expect(incidents.length).toBeGreaterThanOrEqual(1);
    expect(incidents[0].severity).toBe("SEV-1");
    expect(incidents[0].status).toBe("resolved");
  });

  it("loads runbooks and career experience commits", () => {
    const runbooks = getAllRunbooks();
    expect(runbooks.length).toBeGreaterThanOrEqual(1);
    expect(runbooks[0].slug).toBe("zero-downtime-postgres-migrations");

    const experience = getAllExperience();
    expect(experience.length).toBeGreaterThanOrEqual(3);
    expect(experience[0].hash).toBeDefined();
    expect(experience[0].diff.additions).toBeGreaterThan(0);
  });

  it("generates a valid JSON Resume schema payload", () => {
    const jsonResume = generateResumeJson();
    expect(jsonResume.$schema).toContain("jsonresume");
    expect(jsonResume.basics.name).toBe("Jagannath Mukherjee");
    expect(jsonResume.work.length).toBeGreaterThanOrEqual(3);
    expect(jsonResume.projects.length).toBeGreaterThanOrEqual(2);
  });

  it("generates an ANSI colored curl résumé for CLI visitors", () => {
    const cliResume = generateCurlResume();
    expect(cliResume).toContain("\x1b[");
    expect(cliResume).toContain("CAREER GIT LOG");
    expect(cliResume).toContain("PRODUCTION SERVICES");
    expect(cliResume).toContain("SYSTEM COMMANDS");
  });

  it("strictly validates service schemas and rejects invalid data", () => {
    const invalidService = {
      title: "Broken Service",
      slug: "broken",
      tagline: "Invalid",
      status: "super-broken", // Invalid enum
      uptime_30d: 150, // Out of range > 100
      latency_p99: "5ms",
      qps: "100",
      github_url: "not-a-url",
      stack: ["Go"],
      skills: ["Testing"],
    };

    const result = ServiceFrontmatterSchema.safeParse(invalidService);
    expect(result.success).toBe(false);
  });
});
