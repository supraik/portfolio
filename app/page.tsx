import React from "react";
import { PortfolioMain } from "@/components/portfolio-main";
import {
  getAllServices,
  getAllIncidents,
  getAllRunbooks,
  getAllExperience,
} from "@/lib/content";

export const dynamic = "force-static";

export default function HomePage() {
  const services = getAllServices();
  const incidents = getAllIncidents();
  const runbooks = getAllRunbooks();
  const experience = getAllExperience();

  return (
    <PortfolioMain
      services={services}
      incidents={incidents}
      runbooks={runbooks}
      experience={experience}
    />
  );
}
