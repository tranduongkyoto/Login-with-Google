// USING AUTH0 SAMPLE, port 3000

const { auth, requiresAuth } = require('express-openid-connect');
const express = require('express');
require('dotenv').config();

const app = express();

// config auth0

app.use(
  auth({
    authRequired: false,
    auth0Logout: true, // go to  /logout to logout
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    secret: process.env.AUTH0_SECRET,
  })
);

// Auth0 routes

app.get('/', (req, res, next) => {
  res.send(
    req.oidc.isAuthenticated()
      ? 'Logged In via Google using Auth0'
      : 'Not log in'
  );
});

//get info google account after login with Auth0

app.get('/profile', requiresAuth(), (req, res) => {
  res.json(req.oidc.user);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT} by Duong Ace`);
});
