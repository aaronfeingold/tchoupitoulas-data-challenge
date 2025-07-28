import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { db, accounts, users, verificationTokens } from "@/db";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";
import { sendMagicLinkEmail } from "./mailersend";

export const authOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    EmailProvider({
      maxAge: 24 * 60 * 60, // 24 hours
      sendVerificationRequest: async ({ identifier: email, url }) => {
        try {
          await sendMagicLinkEmail(email, url);
        } catch (error) {
          console.error("Failed to send magic link email:", error);
          throw new Error(
            "Failed to send verification email. Please try again."
          );
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ user, token }: { user: User; token: JWT }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
};
