const type = 'avatars';
const express = require('express');
const upload = require('../upload');
const del = require('../delete');
const router = express.Router();

router.post('/:id', (req, res) => {
  upload(req, res, type, req.params.id);
})

router.delete('/:id', (req, res) => {
  del(req, res, type, req.params.id);
})

module.exports = router;