const config = require('./config.json');
const fileExists = require('file-exists');
const keys = config.keys;
const fs = require('fs');

module.exports = async (req, res, type = 'attachments', id = '', uid = '') => {
  const key = req.headers.authorization;
  if (keys.indexOf(key) == -1) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  const filePath = id ? `${__dirname}/uploads/${type}/${id}/${uid}` : `${__dirname}/uploads/${type}/${uid}`;
  if (!await fileExists(filePath)) {
    return res.status(400).json({ message: 'File doesn\'t exist' });
  }

  fs.unlink(filePath, (err) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'An error occured whilst trying to save the file.' });
      }

      res.status(200).json({ message: 'File deleted' });
  });
}
