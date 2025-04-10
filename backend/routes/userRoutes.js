// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { getUserDetails } = require('../controllers/userController');
const auth = require('../middleware/auth');

// Get user details (Token consumption and join date)
router.get('/:id', auth, getUserDetails);

module.exports = router;
