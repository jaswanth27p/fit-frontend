/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import { User, type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { deleteCookie, getCookie, setCookie } from "~/actions/cookies";
import { db } from "~/server/db";
import jwt from "jsonwebtoken";
import { env } from "~/env";

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
      role: UserRole;
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
  ],
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  events: {
    createUser: async ({ user }: { user: User }) => {
      "use server";
      const role = await getCookie("role");
      console.log("role->", role);
      if (role && user.id) {
        await db.user.update({
          where: { id: user.id },
          data: { role: role as UserRole },
        });
        await deleteCookie("role");
      }
    },
    signOut: async () => {
      "use server";
      await deleteCookie("role");
      await deleteCookie("token-for-backend");
    },
    session: async ({ token }) => {
      "use server";
      const tokenBackend = jwt.sign(token, env.AUTH_SECRET!);
      await setCookie("token-for-backend", tokenBackend);
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = "role" in user ? user.role : UserRole.USER;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as UserRole;
      return session;
    },
  },
} satisfies NextAuthConfig;
