import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { deleteCookie, getCookie } from "~/actions/cookies";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role : UserRole;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    DiscordProvider,
  ],
  adapter: PrismaAdapter(db),
  events: {
    async createUser({ user }) {
      // this is the important step
      const role = await getCookie("role");
      if (role && role in UserRole) {
        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            role: role as UserRole,
          },
        });
        await deleteCookie("role");
      }
    },
  },
  session: { strategy: "jwt" },
  callbacks: {
    session: ({ session, token }) => {
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub, // Use token.sub which contains the user ID
            role: token.role as UserRole, // Add role from token
          },
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      // When initial sign in happens, user object is available
      if (user) {
        // Get user from database to ensure we have the role
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: { id: true, role: true },
        });

        return {
          ...token,
          id: user.id,
          role: dbUser?.role ?? UserRole.USER, // Fallback to default role
        };
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
