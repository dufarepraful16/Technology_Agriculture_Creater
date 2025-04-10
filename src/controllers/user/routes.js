const express = require('express');
const router = express.Router();
const AuthController = require('./user');
const auth = require('../../middleware/authMiddleware');

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);


module.exports = router;
