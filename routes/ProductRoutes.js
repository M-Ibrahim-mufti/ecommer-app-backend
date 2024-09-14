const express = require('express')
const router = express.Router();
const ProductController = require('../controller/ProductController')
const VerifyUser = require('../utilities/AuthUtilities')

router.post('/product/Upload-Image',VerifyUser, ProductController.uploadImage);
router.post('/product/delete-image',VerifyUser, ProductController.deleteImage);
router.post('/product/update-product',VerifyUser, ProductController.updateProduct)
router.post('/product/Add-product',VerifyUser, ProductController.addProduct);
router.get('/product/All-products',VerifyUser, ProductController.getAllProducts);
router.get('/product/All-user-products',VerifyUser, ProductController.getAllUserProducts);
router.get('/product/Get-Product-Details', VerifyUser ,ProductController.getSingleProducts);
router.get('/product/featured',VerifyUser, ProductController.getFeatured);


module.exports = router