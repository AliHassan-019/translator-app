const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const adminController = require('../controllers/adminController');

router.get('/users', auth, admin, adminController.getAllUsers);
router.put('/users/:id/tokens', auth, admin, adminController.updateUserTokens);

module.exports = router;