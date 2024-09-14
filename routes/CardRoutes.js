const express = require('express')
const router = express.Router();
const CardController = require('../controller/CardController');
const VerifyUser = require('../utilities/AuthUtilities');

router.post('/card/add-details', VerifyUser ,CardController.addCardDetail)
router.get('/card/fetch-details', VerifyUser , CardController.getCardDetails)

module.exports = router