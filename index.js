const express = require('express');
const router = express.Router();
const upload = require('express-fileupload');
const fs = require('fs');
const config = require('./config.json');

// CORS
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://popletapp.com');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Super-Properties, X-Context-Properties, X-Failed-Requests, If-None-Match');
  res.setHeader('Access-Control-Max-Age', '86400')
  next();
});

router.use(
  upload({
    safeFileNames: true,
    preserveExtension: true,
    limits: {
        fileSize: 5e6
    }
  })
);

const ROUTES = ['avatars', 'attachments'];
for (const route of ROUTES) {
  const mod = require(`./routes/${route}`);
  router.use(`/${route}`, mod)
  router.use(`/${route}`, express.static(`${__dirname}/uploads/${route}`));
}

module.exports = router;