const config = require('./config.json');
const keys = config.keys;
const generateUUID = require('./utils/generateUUID');
const path = require('path');
const fs = require('fs');

module.exports = (req, res, type = 'attachments', id = '') => {
  const key = req.headers.authorization;
  if (!fs.existsSync(`${__dirname}/uploads/`)) {
    fs.mkdirSync(`${__dirname}/uploads/`);
  }

  if (!fs.existsSync(`${__dirname}/uploads/${type}/`)) {
    fs.mkdirSync(`${__dirname}/uploads/${type}/`);
  }

  if (id && !fs.existsSync(`${__dirname}/uploads/${type}/${id}/`)) {
    fs.mkdirSync(`${__dirname}/uploads/${type}/${id}/`);
  }

  if (keys.indexOf(key) === -1) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  if (!req.files.file) {
    return res.status(400).json({ message: 'No attachments present' });
  }

  const file = req.files.file;
  const fileExtension = path.extname(file.name);
  const newFileName = `${generateUUID()}${fileExtension}`;
  const uploadPath = id ? `${__dirname}/uploads/${type}/${id}/${newFileName}` : `${__dirname}/uploads/${type}/${newFileName}`;

  if (config.limits[type] && file.size > config.limits[type]) {
    return res.status(413).json({ message: `Filesize cannot be larger than ${config.limits[type]}` });
  }

  if (config.fileExtensionValidation.indexOf(fileExtension) === -1) {
    return res.status(400).json({ message: 'Invalid file extension' });
  }
  file.mv(uploadPath, (err) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'An error occured whilst trying to save the file.' });
      }
      console.log('Uploaded file ' + file.name + ' to ' + newFileName);
      res.status(200).json({
        link: `https://popletapp.com/${type}/${id}/${newFileName}`,
        type,
        id,
        filename: newFileName
      });
  });
}
