const mongoose = require('mongoose');

const AuthenticationSchema = mongoose.Schema({
    UserName: {
        type:String,
        required:true,
    },
    Email: {
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    Password:{
        type:String,
        required:true
    },
    Address: {
        type:String,
        default: 'not provided'
    },
    Role: {
        type:String,
        default:'Buyer',
        enum:['Seller', 'Buyer', 'Hybrid']
    },
    Image: {
        type:String,
        default: 'not provided'
    },
    Country: {
        type:String,
        default: 'not provided'
    },
    City: {
        type:String,
        default: 'not provided'
    },
    PostalCode: {
        type:String,
        default: 'not provided'
    },
    PhoneNumber: {
        type:String,
        default: 'not provided'
    },

},{ timestamps:true, versionKey:false  })


module.exports = mongoose.model("Authentication", AuthenticationSchema);