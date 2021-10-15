var session = require('express-session');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');

const { auth, requiresAuth } = require('express-openid-connect');
const express = require('express');
require('dotenv').config();

const app = express();
//AUTH0
// config auth0
app.use(
  auth({
    authRequired: false,
    // /logout to logout
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    secret: process.env.AUTH0_SECRET,
  })
);
// Auth0 route
app.get('/', (req, res, next) => {
  res.send(
    req.oidc.isAuthenticated()
      ? 'Logged In via Google using Auth0'
      : 'Not log in'
  );
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.json(req.oidc.user);
});

//PASSPORT
//config passport
app.use(
  session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
  })
);

// passport init
app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      //Insert local account using info of google account

      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
      done(null, profile);
    }
  )
);
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login'],
  })
);
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    console.log(req.session.passport.user);
    res.redirect('/auth/google/me');
  }
);

app.get('/auth/google/me', (req, res, next) => {
  res.json(
    req.session.passport.user
      ? req.session.passport.user
      : 'Not logged in with Passport'
  );
  // res.redirect('/');
});
app.get('/auth/google/logout', (req, res, next) => {
  req.logout();
  res.send('Logged out!!!');
  // res.redirect('/');
});
//
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT} by Duong Ace`);
});
