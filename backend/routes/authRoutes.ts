import { Router } from "express";
import { signIn, signOut } from "../auth";

const router = Router();

// GET /api/auth/login  -> starts BYU OAuth
router.get("/login", async (req, res) => {
  // Optional: pass callbackUrl as query ?callbackUrl=/wherever
  const cb = (req.query.callbackUrl as string) || "/";
  await signIn(req, res, {
    provider: "byu-pkce",
    callbackUrl: cb,
  });
});

// GET /api/auth/logout -> clears session and redirects to home (or ?callbackUrl=)
router.get("/logout", async (req, res) => {
  const cb = (req.query.callbackUrl as string) || "/";
  await signOut(req, res, { redirectTo: cb });
});

// GET /api/auth/error -> simple error landing page
router.get("/error", (req, res) => {
  const message = (req.query?.error as string) || "Authentication error";
  res.status(400).send(`Auth Error: ${message}`);
});

export default router;
