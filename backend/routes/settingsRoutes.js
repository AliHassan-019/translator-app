// backend/routes/settingsRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { getOpenaiKey, updateOpenaiKey } = require('../controllers/settingsController');

router.get('/openai', auth, admin, getOpenaiKey);
router.patch('/openai', auth, admin, updateOpenaiKey);

module.exports = router;
