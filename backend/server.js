require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const courseRoutes = require("./routes/courseRoutes");
const trackRoutes = require("./routes/trackRoutes");
const majorRoutes = require("./routes/majorRoutes");
const skillRoutes = require("./routes/skillRoutes");
const companyRoutes = require("./routes/companyRoutes");

const allowedOrigins = [
  'http://ecetracks.byu.edu',
  'http://localhost:5173',
  'http://localhost:3000'
];


const app = express();
app.use(express.json());
app.use(cors({ origin: allowedOrigins }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/courses", courseRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/majors", majorRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/companies", companyRoutes);

const PORT = process.env.PORT;
const IP = process.env.IP;
app.listen(PORT, IP, () => console.log(`Server running on port ${PORT}`));

