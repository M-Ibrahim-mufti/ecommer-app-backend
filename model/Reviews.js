const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    Product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    ReviewName:{
        type:String,
        default:'anonymouse'
    },
    Rating:{
        type:String,
        required:true,
    },
    Reviews:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Reviews', reviewSchema);