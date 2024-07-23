const express = require('express')
const router = express.Router();
const CardController = require('../controller/CardController');

router.post('/card/add-details',CardController.addCardDetail)
router.get('/card/fetch-details', CardController.getCardDetails)

module.exports = router