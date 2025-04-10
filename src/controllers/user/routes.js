const express = require('express');
const router = express.Router();
const AuthController = require('./user');
const auth = require('../../middleware/authMiddleware');

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);

// router.get('/admin', auth('admin'), (req, res) => {
//   res.json({ message: 'Hello Admin!' });
// });

// router.get('/user', auth(['user', 'admin']), (req, res) => {
//   res.json({ message: 'Hello User or Admin!' });
// });

module.exports = router;
