import { auth } from "../auth/index.js";

// Attach session to req and 401 if missing
export async function requireAuth(req, res, next) {
  try {
    const session = await auth(req, res);
    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.session = session;
    return next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
// export const requireAuthMiddleware: RequestHandler = requireAuth;