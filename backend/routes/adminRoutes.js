// backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');      // Should be a function
const admin = require('../middleware/admin');    // Should be a function
const { getAllUsers, updateUserTokens } = require('../controllers/adminController');

// GET all users (admin only)
router.get('/users', auth, admin, getAllUsers);

// PATCH update tokens for a user (admin only)
router.patch('/users/:id', auth, admin, updateUserTokens);

module.exports = router;
