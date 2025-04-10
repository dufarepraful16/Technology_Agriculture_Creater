const express = require('express');
const router = express.Router();
const farmerController = require('../farmerDeatils/farmerDetails');
const authenticateUser = require('../../middleware/authMiddleware');

router.post('/create', authenticateUser, farmerController.createFarmer);
router.get('/', farmerController.getAll);

module.exports = router;
