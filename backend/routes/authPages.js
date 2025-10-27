// src/routes/authPages.js
import { Router } from "express";

const router = Router();

// GET /api/auth/login -> triggers the SDK's /api/auth/signin via res.login()
router.get("/login", (req, res) => {
  const redirect = typeof req.query.callbackUrl === "string" ? req.query.callbackUrl : "/";
  res.login(redirect); // provided by @byu-oit-sdk/express
});

// GET /api/auth/logout -> triggers SDK logout via res.logout()
router.get("/logout", (req, res) => {
  const redirect = typeof req.query.callbackUrl === "string" ? req.query.callbackUrl : "/";
  res.logout(redirect);
});

// Optional: show who is logged in (after login completes)
router.get("/me", (req, res) => {
  res.type("json").send(req.session?.user ?? { anonymous: true });
});

// Simple error page (SDK redirects here on errors)
router.get("/error", (req, res) => {
  res.status(400).send(`Auth Error: ${req.query?.error || "Unknown error"}`);
});

router.get("/session", (req, res) => {
  res.type("json").send(req.session);
});

export default router;
