const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Public routes
router.post('/register', validate(schemas.register), authController.register);
router.post('/login', validate(schemas.login), authController.login);

// Protected routes
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, validate(schemas.updateProfile), authController.updateProfile);

module.exports = router;
