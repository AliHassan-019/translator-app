const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const translationController = require('../controllers/translationController');

// Configure Multer
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB limit
  }
});

// Text translation route
router.post('/text', auth, translationController.translateText);

// Audio translation route - using 'audio' as the field name
router.post('/audio', auth, upload.single('file'), translationController.translateAudio);

module.exports = router;