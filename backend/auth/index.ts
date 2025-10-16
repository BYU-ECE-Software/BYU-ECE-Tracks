import { ExpressAuth } from "@auth/express";
import BYUPKCE from "./byu-provider";

export const { handlers, signIn, signOut, auth } = ExpressAuth({
  // REQUIRED for Auth.js (set AUTH_SECRET in .env)
  secret: process.env.AUTH_SECRET,

  providers: [BYUPKCE()],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.user = {
          id: (user as any).id,
          name: (user as any).name,
          email: (user as any).email,
        };
        token.accessToken = account?.access_token;
        token.expiresAt = Number((user as any).expiresAt);
        token.firstName = (user as any).firstName;
        token.netId = (user as any).netId;
      }
      return token;
    },

    async session({ session, token }) {
      // mirror your NextAuth behavior
      (session as any).user = token.user ?? {};
      (session as any).user.expiresAt = token.expiresAt as number;
      (session as any).user.firstName = token.firstName as string;
      (session as any).user.id = token.netId as string;
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      const urlOrigin = new URL(url).origin;
      const baseOrigin = new URL(baseUrl).origin;
      const issuerOrigin = new URL(process.env.BYU_ISSUER!).origin;

      if (urlOrigin === baseOrigin) return url;
      if (urlOrigin === issuerOrigin) return url;
      return baseUrl;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 60 * 60,
  },

  // In Express we’ll create routes to call signIn/signOut.
  // Keeping these paths makes your existing links consistent.
  pages: {
    signIn: `/api/auth/login`,
    signOut: `/api/auth/logout`,
    error: `/api/auth/error`,
  },
});
