export interface OwnerConfig {
  name: string;
  handle: string;
  role: string;
  location: string;
  domain: string;
  email_public: string;
  github: string;
  linkedin: string;
  resume_pdf: string;
  admin_github_usernames: string[];
  timezone: string;
  personality: {
    tone: string;
    signature_interest: string;
  };
}

export const OWNER_CONFIG: OwnerConfig = {
  name: process.env.NEXT_PUBLIC_OWNER_NAME || "Jagannath Mukherjee",
  handle: process.env.NEXT_PUBLIC_OWNER_HANDLE || "jagannath-m",
  role: "Staff Systems & Full-Stack Engineer",
  location: "Gurugram, India",
  domain: "jagannath.dev",
  email_public: "hi@jagannath.dev",
  github: "https://github.com/jagannath-m",
  linkedin: "https://linkedin.com/in/jagannath-m",
  resume_pdf: "/resume.pdf",
  admin_github_usernames: ["jagannath-m", "TODO_ADMIN_GITHUB_USER"],
  timezone: "Asia/Kolkata",
  personality: {
    tone: "dry, precise, a little playful",
    signature_interest: "distributed systems & real-time telemetry",
  },
};
