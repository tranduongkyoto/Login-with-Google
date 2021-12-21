// USING PASSPORT SAMPLE, port 4000

var session = require('express-session');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');

const express = require('express');
require('dotenv').config();

const app = express();

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

// Custom Google Strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/auth/google/callback',
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

//Passport routes

// Routes login

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

// Redirect here after login

app.get('/auth/google/me', (req, res, next) => {
  res.json(
    req.session.passport.user
      ? req.session.passport.user
      : 'Not logged in with Passport'
  );
});

//Logout

app.get('/auth/google/logout', (req, res, next) => {
  req.logout();
  res.send('Logged out!!!');
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT} by Duong Ace`);
});
