import dotenv from "dotenv"; dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import { Strategy as SamlStrategy } from "@node-saml/passport-saml";
import axios from "axios";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { setupSessions } from "./utils/sessions.js";
// import bodyParser from "body-parser";

import  courseRoutes from "./routes/courseRoutes.js";
import  trackRoutes  from "./routes/trackRoutes.js";
import  supertrackRoutes  from "./routes/supertrackRoutes.js";
import  uploadRoutes from "./routes/uploadRoutes.js";

// const authRoutes = require("./routes/authRoutes");

const allowedOrigins = [
  "https://ecetracks.byu.edu",
  "http://localhost:5173",
  "http://localhost:3000",
];

// const bodyParser = bodyParser.urlencoded({ extended: false });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CERT_DIR = process.env.CERT_DIR || path.join(__dirname, "certs");

console.log("Using certificate directory:", CERT_DIR);

const app = express();
await setupSessions(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));

//Upload to Minio Routes
// const uploadRoute = require("./routes/uploadRoutes");

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//Build URL variables bc we are good devs
const BASE_URL = process.env.BASE_URL || "https://ecetracks.byu.edu";
const CALLBACK_PATH = process.env.CALLBACK_PATH || "/api/auth/login/callback";
const LOGOUT_CALLBACK_PATH =
  process.env.LOGOUT_CALLBACK_PATH || "/api/auth/logout/callback";

//Read certs and keys in as vars bc we are still good devs
const idpCert = fs.readFileSync(
  path.join(CERT_DIR, "byu_idp_signing_cert.pem"),
  "utf8"
); // IdP x509 cert
const spKey = fs.readFileSync(path.join(CERT_DIR, "SAML_sign_bundle.key"), "utf8"); // SP private key
const spCert = fs.existsSync(path.join(CERT_DIR, "SAML_sign_leaf.crt"))
  ? fs.readFileSync(path.join(CERT_DIR, "SAML_sign_leaf.crt"), "utf8") // optional but useful for metadata
  : null;

const samlStrategy = new SamlStrategy(
  {
    //Core
    issuer: `${BASE_URL}`,
    entryPoint: "https://cas.byu.edu/cas/idp/profile/SAML2/Redirect/SSO", //Idp SSO URL
    callbackUrl: `${BASE_URL}${CALLBACK_PATH}`,
    idpCert: idpCert,
    privateKey: spKey,
    decryptionPvk: spKey,

    //Logging out
    logoutUrl: "https://cas.byu.edu/cas/idp/profile/SAML2/POST/SLO", //Idp SLO endpoint
    logoutCallbackUrl: `${BASE_URL}${LOGOUT_CALLBACK_PATH}`,

    //Security Preferences
    signatureAlgorithm: "sha256",
    digestAlgorithm: "sha256",
    wantAssertionsSigned: false,
    wantAuthnResponseSigned: false, //maybe false?
    validateInResponseTo: "always",
    disableRequestedAuthnContext: true,
    identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:unspecified',
    // authnContext: [
    //   "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
    // ],

    // acceptedClockSkewMs: 3000, // 3s skew tolerance
    // forceAuthn: false,
  },
  (profile, done) => {
    // This function is called after successful authentication
    // The profile contains SAML assertion attributes
    return done(null, {
      id: profile["byuId"],
      name: profile["nameID"],
      nameIDFormat: profile["nameIDFormat"],
      // isAdmin: profile['isAdmin'] || false, // Adjust attribute name as per IdP configuration
      attributes: profile,
    });
  }
);

// Use the SAML strategy
passport.use(samlStrategy);

// Serialize user to session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// Routes

// SP Metadata
app.get("/api/saml/metadata", (req, res) => {
  res.type("application/xml");
  res.send(samlStrategy.generateServiceProviderMetadata(spCert, spCert));
});

// SAML Login Route (initiates SSO)
app.get(
  "/api/auth/login",
  passport.authenticate("saml", {
    failureRedirect: "/",
  }),
  function (req, res) {
    res.redirect("/");
  }
  // successRedirect: "/admin",
  // failureRedirect: "/login",
);
//OIT CODE
// app.get(
//     '/login/byu-cas-saml',
//     passport.authenticate("saml", {
//         failureRedirect: "/",
//         failureFlash: true
//     }),
//     function (req, res) {
//         res.redirect("/");
//     },
// );


// SAML Callback Route (handles IdP response)
app.post(
  CALLBACK_PATH,
  // bodyParser.urlencoded({ extended: false }),
  passport.authenticate("saml", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      const auth_String = Buffer.from(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
      ).toString("base64");
      const authoptions = {
        method: "POST",
        url: "https://api.byu.edu/token",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          authorization: `Basic ${auth_String}`,
        },
        data: `grant_type=client_credentials`,
      };
      const authResponse = await axios.request(authoptions);
      const accessToken = authResponse.data.access_token;
      // User is authenticated, fetch additional data from API
      const userId = req.user.id;
      const options = {
        method: "GET",
        url: `https://api.byu.edu/byuapi/persons/v4/${userId}`,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.request(options);
      const userData = response.data;
      req.session.userData = userData;
      // req.user.isAdmin = userData.isAdmin || req.user.isAdmin; // Update admin status
      // req.session.user = req.user; // Store user in session
      res.redirect("/admin");
    } catch (error) {
      console.error("API Error:", error);
      res.redirect("/error");
    }
  }
);

// Admin Route (protected)
app.get("/admin", ensureAuthenticated, (req, res) => {
  res.json({
    user: req.user,
    isAdmin: !!req.user.isAdmin,
  });
});

// SLO Route (initiates Single Logout)
app.get("/api/auth/logout", ensureAuthenticated, (req, res) => {
  req.user = req.user || {};
  if (!req.user.nameID) {
    // fallback to session user if needed
    req.user.nameID = req.session?.passport?.user?.nameID;
    req.user.nameIDFormat = req.session?.passport?.user?.nameIDFormat;
  }

  samlStrategy.logout(req, (err, requestUrl) => {
    if (err) {
      console.error('SAML SLO error:', err);
      return res.redirect('/error');
    }
    // Redirect to IdP for SLO
    return res.redirect(requestUrl);
  });
});

// SLO Callback Route
app.post(LOGOUT_CALLBACK_PATH, (req, res) => {
  // Clear local session
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  });
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/courses", courseRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/supertracks", supertrackRoutes);
app.use("/api", uploadRoutes);

// app.use("/api/auth", authRoutes);

const PORT = process.env.PORT;
const IP = process.env.IP;
app.listen(PORT, IP, () => console.log(`Server running on port ${PORT}`));
