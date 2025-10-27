// src/routes/profileRoutes.js
import { Router } from "express";
import { authenticate } from "@byu-oit-sdk/express";
import { PersonsClient, GetPersonCommand, GetEmailAddressesCommand } from "@byu-oit-sdk/client-persons";

const router = Router();

// Optionally reuse a single client instance
const personsClient = new PersonsClient({
  // credentials: false would disable auto token, so omit or leave default
});

// Simple “who am I” plus Person lookup
router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ error: "Not logged in" });
    }
    // If you stored byuId in session.user:
    const byuId = user.byuId;
    if (!byuId) {
      return res.status(400).json({ error: "Session user has no byuId" });
    }

    // Use PersonsClient to get full person record
    const cmd = new GetPersonCommand({ byuId, fieldSets: ["basic", "email_addresses"] });
    const person = await personsClient.send(cmd);

    // You can also fetch email addresses separately:
    // const emailCmd = new GetEmailAddressesCommand({ byuId });
    // const emails = await personsClient.send(emailCmd);

    res.json({
      sessionUser: user,
      person,
      // emails: emails.email_addresses
    });
  } catch (err) {
    next(err);
  }
});

export default router;
