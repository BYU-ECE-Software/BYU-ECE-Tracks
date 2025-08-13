require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const SamlStrategy = require('@node-saml/passport-saml').Strategy;
const axios = require('axios');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');

const courseRoutes = require("./routes/courseRoutes");
const trackRoutes = require("./routes/trackRoutes");
const supertrackRoutes = require("./routes/supertrackRoutes");
// const authRoutes = require("./routes/authRoutes");

const allowedOrigins = [
  'http://ecetracks.byu.edu',
  'http://localhost:5173',
  'http://localhost:3000'
];


const app = express();
app.use(express.json());
app.use(cors({ origin: allowedOrigins }));

//Upload to Minio Routes
const uploadRoute = require('./routes/uploadRoutes');
app.use('/api', uploadRoute);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'session_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport SAML Strategy
// passport.use(new SamlStrategy({
//   path: '/api/login/callback',
//   entryPoint: 'https://cas.byu.edu/cas/idp/profile/SAML2/POST/SSO',
//   issuer: 'https://ecetracks.byu.edu',
//   callbackUrl: 'https://ecetracks.byu.edu/api/login/callback',
//   cert: fs.readFileSync('./certs/byu_idp_signing_cert.pem', 'utf8'), // IdP public certificate
//   privateKey: fs.readFileSync('./certs/saml_sign.key', 'utf8'), // SP private key
//   decryptionPvk: fs.readFileSync('./certs/saml_sign.key', 'utf8'), // SP private key for decryption
//   signatureAlgorithm: 'sha256',
//   logoutUrl: 'https://cas.byu.edu/cas/idp/profile/SAML2/POST/SLO',
//   logoutCallbackUrl: 'https://ecetracks.byu.edu/api/logout/callback'
// }, (profile, done) => {
//   // Profile contains SAML assertion attributes
//   return done(null, {
//     id: profile['nameID'],
//     // isAdmin: profile['isAdmin'] || false, // Adjust attribute name as per IdP configuration
//     attributes: profile
//   });
// }));

// Serialize user to session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
// SAML Login Route (initiates SSO)
app.get('/api/auth/login', passport.authenticate('saml', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));

// SAML Callback Route (handles IdP response)
app.post('/api/auth/login/callback',
  passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true }),
  async (req, res) => {
    try {
      const Auth_String = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');
      const authoptions = {
        method: 'POST',
        url: 'https://api.byu.edu/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': `Basic ${Auth_String}` },
        data: `grant_type=client_credentials`
      };
      const authResponse = await axios.request(authoptions);
      const accessToken = authResponse.data.access_token;
      // User is authenticated, fetch additional data from API
      const userId = req.user.id;
      options = {
        method: 'GET',
        url: `https://api.byu.edu/byuapi/persons/v4/${userId}`,
        headers: {Accept: 'application/json', Authorization: `Bearer ${accessToken}`}
      };
      const response = await axios.request(options);
      const userData = response.data;
      // req.user.isAdmin = userData.isAdmin || req.user.isAdmin; // Update admin status
      req.session.user = req.user; // Store user in session
      res.redirect('/dashboard');
    } catch (error) {
      console.error('API Error:', error);
      res.redirect('/error');
    }
  }
);

// Admin Route (protected)
app.get('/admin', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  res.json({
    user: req.user,
    isAdmin: req.user.isAdmin
  });
});

// SLO Route (initiates Single Logout)
app.get('/api/auth/logout', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  req.logout((err) => {
    if (err) return res.redirect('/error');
    res.redirect('/api/saml/logout');
  });
});

// SAML SLO Route
app.get('/api/auth/saml/logout', passport.authenticate('saml', {
  samlLogoutRequest: {
    LogoutRequest: true
  }
}));

// SLO Callback Route
app.post('/api/auth/logout/callback', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/courses", courseRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/supertracks", supertrackRoutes);
// app.use("/api/auth", authRoutes);

const PORT = process.env.PORT;
const IP = process.env.IP;
app.listen(PORT, IP, () => console.log(`Server running on port ${PORT}`));

