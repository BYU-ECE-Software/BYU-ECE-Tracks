import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get("/me", requireAuth, (req, res) => {
  const session = (req as any).session;
  res.json({
    user: session.user,
  });
});

export default router;
