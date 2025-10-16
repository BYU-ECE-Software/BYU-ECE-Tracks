import dotenv from "dotenv"; dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// import { setupSessions } from "./utils/sessions.js";
import { ExpressAuth } from "@auth/express";
// import bodyParser from "body-parser";


import  courseRoutes from "./routes/courseRoutes.js";
import  trackRoutes  from "./routes/trackRoutes.js";
import  supertrackRoutes  from "./routes/supertrackRoutes.js";
import  uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import { handlers as authHandlers } from "./auth/index.js";
import authPagesRouter from "./routes/authPages.js";
import { requireAuth } from "./middleware/requireAuth.js";


const allowedOrigins = [
  "https://ecetracks.byu.edu",
  "http://localhost:5173",
  "http://localhost:3000",
];

// const bodyParser = bodyParser.urlencoded({ extended: false });

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const CERT_DIR = process.env.CERT_DIR || path.join(__dirname, "certs");

// console.log("Using certificate directory:", CERT_DIR);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));

//Upload to Minio Routes
// const uploadRoute = require("./routes/uploadRoutes");

app.use("/api/auth", authHandlers);

//Friendly pages that call signin/signout
app.use("/api/auth", authPagesRouter);

app.use("/api/courses", courseRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/supertracks", supertrackRoutes);
app.use("/api", uploadRoutes);

// Routes

// Admin Route (protected)
app.get("/admin", requireAuth, (req, res) => {
  res.json({
    user: req.session.user,
    isAdmin: !!req.session.user?.isAdmin,
  });
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
