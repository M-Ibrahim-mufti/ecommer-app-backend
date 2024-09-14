const express = require('express')
const router = express.Router();
const CartController = require('../controller/CartController');
const VerifyUser = require('../utilities/AuthUtilities');

router.post('/Cart/AddToCart',VerifyUser, CartController.addToCart)
router.get('/Cart/AllCheckOutProductLength',VerifyUser, CartController.getAllCartProduct);
router.delete('/Cart/removeFromCart/:id',VerifyUser, CartController.RemoveFromCart)

module.exports = router