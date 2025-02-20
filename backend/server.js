require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const courseRoutes = require("./routes/courseRoutes");
const trackRoutes = require("./routes/trackRoutes");
const majorRoutes = require("./routes/majorRoutes");
const skillRoutes = require("./routes/skillRoutes");
const companyRoutes = require("./routes/companyRoutes");


const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/courses", courseRoutes);
app.use("/tracks", trackRoutes);
app.use("/majors", majorRoutes);
app.use("/skills", skillRoutes);
app.use("/companies", companyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

