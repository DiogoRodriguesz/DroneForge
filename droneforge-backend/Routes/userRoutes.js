const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const authMiddleware = require('../Middleware/authMiddleware');

// Route for user registration
router.post('/register', userController.registerUser);

// Route for user login
router.post('/login', userController.loginUser);

// Route for editing user profile
router.put('/edit', authMiddleware, userController.editUser);

module.exports = router;
