const express = require('express');
const router = express.Router();
const ReviewController = require('../controller/ReviewController');

router.post('/review/add-review', ReviewController.addReviews)

module.exports = router;