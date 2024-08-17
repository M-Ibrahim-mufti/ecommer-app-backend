const mongoose = require('mongoose');
const Product = require('./Product');

const CartSchema = mongoose.Schema({
    ProductName:{
        type:String,
        required:true
    },
    ProductQuantity:{
        type:Number,
        required:true
    },
    PurchaseType:{
        type:String,
        required:true
    },
    Images: {
        type:[String],
        required:true
    },
    ProductSizes:{
        type:[mongoose.Schema.Types.Mixed],
        required:true
    },
    TotalPrice:{
        type:Number,
        required:true
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    Product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    }

})

module.exports = mongoose.model('Cart', CartSchema);