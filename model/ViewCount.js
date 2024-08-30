const mongoose = require('mongoose');

const ViewCountSchema = mongoose.Schema({
    User: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }],
    Product: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    }
},{ timestamps: false, versionKey: false })

module.exports = mongoose.model("ViewCOunt", ViewCountSchema);
