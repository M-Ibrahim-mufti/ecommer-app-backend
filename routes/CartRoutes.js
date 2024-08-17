const express = require('express')
const router = express.Router();
const CartController = require('../controller/CartController');

router.post('/Cart/AddToCart', CartController.addToCart)
router.get('/Cart/AllCheckOutProductLength', CartController.getAllCartProduct);
router.delete('/Cart/removeFromCart/:id', CartController.RemoveFromCart)

module.exports = router