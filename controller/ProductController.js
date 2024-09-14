const Product = require('../model/Product')
const ViewCount = require('../model/ViewCount')

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs')
const crypto = require('crypto');

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
    const productId = req.query.id;
    const userId = req.query.userId;
    const product = await Product.findById(productId)
    if(!product) {
      return res.status(402).json({message: "No Product Found"})
    }
    const viewed = await ViewCount.findOne({
      Product:productId,
    })
    if(!viewed) {
      await new ViewCount({
        Product:productId,
        User:[userId],
      }).save();  
      await Product.findByIdAndUpdate(
        product._id, 
        {$inc: {ViewCount:1}}, 
        {new:true, runValidators:true}
      )
    }else {
      if(!viewed.User.includes(userId)){
        viewed.User.push(userId);
        viewed.save();
        await Product.findByIdAndUpdate(
          product._id, 
          {$inc: {ViewCount:1}}, 
          {new:true, runValidators:true}
        )
      }
    }
    res.status(200).json({product:product, message: "Product Fetched Successfully"})
  } catch(error) {
    console.log(error)
    res.status(500).json({message:"Error from the server please wait and try again" })
  }
} 

exports.deleteImage = async(req,res) => {
  try {
    const { img } = req.body;
    const cloudName = process.env.CLOUDINARY_CLOUDNAME;
    const secretKey = process.env.CLOUDINARY_SECRET_KEY;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const publicId = img.split("/").slice(img.split('/').length - 2, img.split('/').length).join('/').split('.')[0]
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = crypto.createHash('sha1')
        .update(`public_id=${publicId}&timestamp=${timestamp}${secretKey}`)
        .digest('hex');
    
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
    
    console.log("CloudName:", cloudName, '\nSecret Key:', secretKey, '\nAPI Key:', apiKey, '\npublic_id', publicId, '\nSignature', signature, '\n\n\n' );

    const response = await axios.post(url, null, {
      params: {
        public_id: publicId,
        timestamp: timestamp,
        api_key: apiKey,
        signature: signature,
      }
    });

    console.log('Image deleted successfully:', response.data);
    res.status(200).json({ message: 'Image deleted successfully', data: response.data });
  } catch (err) {
    console.error('Error deleting image:', err.response.data.error);
    res.status(500).json({ message: 'Failed to delete image', error: err.message });
  }
}

exports.updateProduct = async(req,res) => {
  try {
    const id = req.body._id;
    const updatedData = req.body;
    console.log(updatedData)
    const product = await Product.findByIdAndUpdate(id, updatedData, {new:true, runValidators:true});
    if(!product) {
      return res.status(404).json({message:'Product Not Found'});
    }
    res.status(200).json({message:"Product Updated Successfully"});

  } catch(err) {
    res.status(500);
  }
}

exports.getFeatured = async (req,res) => {
  try{
    let products = await Product.find();
    products = products.sort((a,b) => b.ViewCount - a.ViewCount);
    products = products.slice(0,3);
    res.status(200).json(products)
  } catch(err) {
    res.status(500);
  }
}