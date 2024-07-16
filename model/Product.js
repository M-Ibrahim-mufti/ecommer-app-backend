const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true,
        enum: ['Clothing', 'Footwear', 'Electronic', 'Home Appliance']
    },
    ClothingSizes: {
        type: [String],
        enum: ['XS', 'SM', 'MD', 'LG', 'XL', 'XXL'],
        default: ['MD']
    },
    ShoeSizes: {
        type: [Number],
        enum: [36, 38, 40, 42, 44, 46, 48],
        default: [40]
    },
    Quantity: {
        type: Number,
        required: true
    },
    Bulk:{
        Quantity:{
            type:Number
        },
        Price: {
            type:Number
        }
    },
    Colors: {
        type:String
    },
    Images: {
        type: [String]
    },
    Price: {
        type: Number,
        required: true
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("Products", ProductSchema);
