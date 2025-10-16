import type { RequestHandler } from "express";
import { auth } from "../auth";

// Attach session to req and 401 if missing
export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const session = await auth(req, res);
    if (!session || !(session as any).user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    (req as any).session = session;
    return next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
