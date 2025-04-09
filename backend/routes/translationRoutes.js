const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const translationController = require('../controllers/translationController');

const upload = multer();

// Text translation endpoint
router.post('/text', auth, translationController.translateText);
// Audio translation endpoint
router.post('/audio', auth, upload.single('file'), translationController.translateAudio);

module.exports = router;
