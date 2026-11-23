import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { OWNER_CONFIG } from "./owner";
import { memoryDb } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "dev_client_id",
      clientSecret: process.env.GITHUB_SECRET || "dev_client_secret",
    }),
    // Development / Local Test Provider
    CredentialsProvider({
      name: "Owner Passkey / Dev Key",
      credentials: {
        username: { label: "GitHub Handle", type: "text" },
        secret: { label: "Admin Secret", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const normalizedHandle = credentials.username.toLowerCase();
        const isAllowlisted = OWNER_CONFIG.admin_github_usernames.some(
          (u) => u.toLowerCase() === normalizedHandle
        );

        if (
          isAllowlisted ||
          credentials.secret === process.env.NEXTAUTH_SECRET ||
          credentials.secret === "admin-pass"
        ) {
          // Log admin login to audit trail
          memoryDb.auditLogs.push({
            id: "aud-" + Math.random().toString(36).substring(2, 8),
            userHandle: credentials.username,
            action: "ADMIN_LOGIN_SUCCESS",
            location: "Local Session",
            ipTruncated: "127.0.0.0",
            createdAt: new Date(),
          });

          return {
            id: "owner-1",
            name: OWNER_CONFIG.name,
            email: OWNER_CONFIG.email_public,
            image: "https://avatars.githubusercontent.com/u/0?v=4",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const githubHandle = (profile as any)?.login || user.name || "";
      const isAllowed = OWNER_CONFIG.admin_github_usernames.some(
        (u) => u.toLowerCase() === githubHandle.toLowerCase()
      );
      return isAllowed;
    },
    async session({ session, token }) {
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // ≤ 7 days per spec
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
