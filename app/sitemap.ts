import { MetadataRoute } from "next";
import { getAllServices, getAllIncidents, getAllRunbooks } from "@/lib/content";
import { OWNER_CONFIG } from "@/lib/owner";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `https://${OWNER_CONFIG.domain}`;

  const services = getAllServices().map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const incidents = getAllIncidents().map((inc) => ({
    url: `${baseUrl}/incidents/${inc.slug}`,
    lastModified: new Date(inc.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const runbooks = getAllRunbooks().map((r) => ({
    url: `${baseUrl}/runbooks/${r.slug}`,
    lastModified: new Date(r.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/uses`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...services,
    ...incidents,
    ...runbooks,
  ];
}
