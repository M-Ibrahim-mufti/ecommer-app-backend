const Product = require('../model/Product')
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs')


exports.uploadImage = async (req, res) => {
  const img = req.files.image;
  const cloudName = process.env.CLOUDINARY_CLOUDNAME;
  const presetName = process.env.CLOUDINARY_PRESETNAME;

  const uploaded_images = img.map( async (file) => {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.tempFilePath));
    formData.append('upload_preset', presetName);
    formData.append('folder', 'Ecommerce-website')
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
      );
      return response.data.secure_url;
    } catch (err) {
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });
  try {
    const imgArray = await Promise.all(uploaded_images)
    res.status(202).json(imgArray);
  } catch(err) {
    console.log("error in the process")
  }
};

exports.addProduct = async (req,res) => {
  try {
    const product = new Product({
      Title: req.body.Title,
      Category: req.body.Category,
      Description: req.body.Description,
      Quantity: req.body.Quantity,
      Images: req.body.Images,
      Price: req.body.Price,
      User:req.body.User,
      ClothingSizes: req.body.ClothingSizes,
      ShoeSizes: req.body.ShoeSizes,
      Colors:req.body.colors,
      Bulk: req.body.Bulk
    })
    await product.save();
    
    res.status(200).json({message: "Product added Successfully"});
  } catch(err) {
    res.status(402).json({message: 'failed to upload product'})
  }
}

exports.getAllProducts = async(req,res)=> {
  try {
    const allProducts = await Product.find()
    res.status(200).json(allProducts);
  } catch(err) {
    console.log(err)
  }
}

exports.getAllUserProducts = async(req,res) => {
  try {
    const userProducts = await Product.find({
      User: req.query.id
    })
    if(userProducts.length === 0) {
      return res.status(400).json({message: "User have no Product to show"})
    }
    
    res.status(200).json(userProducts);
  } catch(err) {
    console.log(err);
  }
}

exports.getSingleProducts = async(req,res) => {
  try {
    const productId = req.query.id
    const product = await Product.findById(productId)
    if(!product) {
      return res.status(402).json({message: "No Product Found"})
    }
    res.status(200).json({product:product, message: "Product Fetched Successfully"})
  } catch(error) {
    console.log(error)
    res.status(500).json({message:"Error from the server please wait and try again" })
  }
} 