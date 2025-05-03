const express = require('express');
const router = express.Router();
const auth = require('../middleware/authorize');
const {uploadMedia} = require('../controllers/mediaController');

router.post('/upload-media', auth,uploadMedia);

module.exports = router;