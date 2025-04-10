const express = require('express');
const router = express.Router();
const farmerController = require('../farmerDeatils/farmerDetails');

router.post('/create', farmerController.createFarmer);
router.get('/', farmerController.getAll);

module.exports = router;
