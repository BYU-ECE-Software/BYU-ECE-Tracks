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
          id: user.id,
          name: user.name,
          email: user.email,
        };
        token.accessToken = account?.access_token;
        token.expiresAt = Number(user.expiresAt);
        token.firstName = user.firstName;
        token.netId = user.netId;
        token.byuId = user.byuId;
      }
      return token;
    },

    async session({ session, token }) {
      // mirror your NextAuth behavior
      session.user = token.user ?? {};
      session.user.expiresAt = token.expiresAt;
      session.user.firstName = token.firstName;
      session.user.id = token.netId;
      session.user.byuId = token.byuId;
      session.accessToken = token.accessToken;
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      const urlOrigin = new URL(url).origin;
      const baseOrigin = new URL(baseUrl).origin;
      const issuerOrigin = new URL(process.env.BYU_ISSUER).origin;

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
