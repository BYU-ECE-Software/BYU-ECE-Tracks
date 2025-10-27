import dotenv from "dotenv"; dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { AuthorizationCodeFlow, authenticate, autoAuthenticate } from "@byu-oit-sdk/express";
import { SessionMiddleware } from "@byu-oit-sdk/session-express";
import { RedisSessionStore } from "./utils/RedisSessionStore.js";
import { createDecoder } from "fast-jwt";

import  courseRoutes from "./routes/courseRoutes.js";
import  trackRoutes  from "./routes/trackRoutes.js";
import  supertrackRoutes  from "./routes/supertrackRoutes.js";
import  uploadRoutes from "./routes/uploadRoutes.js";
import  profileRoutes from "./routes/profileRoutes.js";
import authPagesRouter from "./routes/authPages.js";

const app = express();
app.set("trust proxy", true); // trust first proxy

const allowedOrigins = [
  "https://ecetracks.byu.edu",
  "http://localhost:5173",
  "http://localhost:3000",
];

// --- middleware (parsers + CORS) ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// const isProd = env.get("NODE_ENV").default("development")
//   .asEnum(["production", "development"]) === "production";

/** --- Sessions (Redis) --- */
const store = new RedisSessionStore({
  url: process.env.REDIS_URL? process.env.REDIS_URL : "redis://localhost:6379",
  prefix: process.env.SESSION_PREFIX? process.env.SESSION_PREFIX : "sess",
  maxLockTime: process.env.SESSION_MAX_LOCK_TIME? process.env.SESSION_MAX_LOCK_TIME : 10 // seconds
});

const sessionMiddleware = await SessionMiddleware({
  store,
  name: process.env.BYU_OIT_SESSION_COOKIE? process.env.BYU_OIT_SESSION_COOKIE : "sessionId",
  maxAge: process.env.BYU_OIT_SESSION_MAXAGE? process.env.BYU_OIT_SESSION_MAXAGE : 1200, // seconds
});
app.use(sessionMiddleware);


// --- auth flow (registers /api/auth/signin, /signout, and callback from BYU_OIT_REDIRECT_URI) ---

const decoder = createDecoder();
// --- Auth (Authorization Code flow) ---
await AuthorizationCodeFlow(app, {
  // keep everything under /api/auth/*
  logIn: "/api/auth/signin",
  logOut: "/api/auth/signout",
  errorRedirect: "/api/auth/error",
  logInRedirect: "/",
  logOutRedirect: "/",

  /**
   * BYU returns useful claims in the id_token; decode it to build req.session.user.
   * If your access token is JWT with claims you prefer, you can keep the default;
   * here we explicitly decode id_token for clarity.
   */
  userInfoCallback(token) {
    // token.additional.id_token should contain the BYU id_token (per SDK docs)
    const idToken = token?.additional?.id_token;
    if (typeof idToken !== "string") {
      throw new Error("Missing id_token in token response");
    }
    const payload = decoder(idToken);
    // The SDK example uses `fast-jwt` createDecoder(); we can rely on its built-in decoder,
    // but to keep dependencies minimal, the SDK will decode via its default unless we override getIdToken.
    // If you want strict verification, bring in 'fast-jwt' and verify with BYU JWKS.

    // Map claims similar to your Auth.js profile() mapping
    return {
      sub: payload.sub,
      byuId: payload.byu_id,
      netId: payload.net_id,
      firstName: payload.preferred_first_name,
      lastName: payload.surname,
      exp: payload.exp,
    };
  },
});


//Upload to Minio Routes
// const uploadRoute = require("./routes/uploadRoutes");


//Friendly pages that call signin/signout
app.use("/api/auth", authPagesRouter);
// app.use("/api", autoAuthenticate)

// --- protect specific routes if desired ---
// app.use("/api", autoAuthenticate); // or per-route:
// app.get("/api/secure-data", authenticate, (req, res) => {
//   res.json({ ok: true, user: req.session.user });
// });

app.use("/api/courses", courseRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/supertracks", supertrackRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", uploadRoutes);


// Debug Helpers
app.get("/api/auth/me", (req, res) => {
  res.type("json").send(req.session?.user ?? { anonymous: true });
});

// --- error handler (last) ---
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).send("Something broke!");
});


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


const PORT = process.env.PORT;
const IP = process.env.IP;
app.listen(PORT, IP, () => console.log(`Server running on port ${PORT}`));
