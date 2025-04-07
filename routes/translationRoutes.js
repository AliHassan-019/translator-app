const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const translationController = require('../controllers/translationController');

const upload = multer();

router.post('/translate/text', auth, translationController.translateText);
router.post('/translate/audio', auth, upload.single('file'), translationController.translateAudio);

module.exports = router;