const express = require('express');
const router = express.Router();
const upload = require('express-fileupload');
const fs = require('fs');
const config = require('./config.json');

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
  router.use(`/${route}`, express.static(`./uploads/${route}`));
  router.use(`/${route}`, mod)
}

module.exports = router;