// src/routes/authPages.js
import { Router } from "express";
import { signIn, signOut } from "../auth/index.js";

const router = Router();

router.get("/login", async (req, res) => {
  const callbackUrl = (req.query.callbackUrl && String(req.query.callbackUrl)) || "/";
  await signIn(req, res, { provider: "byu-pkce", callbackUrl });
});

router.get("/logout", async (req, res) => {
  const redirectTo = (req.query.callbackUrl && String(req.query.callbackUrl)) || "/";
  await signOut(req, res, { redirectTo });
});

router.get("/error", (req, res) => {
  res.status(400).send(`Auth Error: ${req.query?.error || "Unknown error"}`);
});

export default router;
