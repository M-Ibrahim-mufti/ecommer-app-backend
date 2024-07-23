const mongoose = require('mongoose');
require('dotenv').config();
const crypto = require('crypto')

const algorithm = "aes-256-cbc";
const secretKey = Buffer.from(process.env.SECRET_KEY, 'hex');
const encryptionLength = 16;

const CardSchema = mongoose.Schema({
    NameOnCard: {
        type:String,
        required:true,
    },
    CardNumber: {
        type:String,
        required:true        
    },
    ExpiryDate: {
        type:Date,
        required:true
    },
    Cvv: {
        type:String,
        required:true
    },
    CardType: {
        type:String,
        enum:['MasterCard', 'VisaCard'],
        required:true
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},  { timestamps: true, versionKey: false })

const encrypt = (text) => {
    console.log(text);
    const encrypting = crypto.randomBytes(encryptionLength);
    const cipheringData = crypto.createCipheriv(algorithm, secretKey, encrypting);
    let encryptedData = cipheringData.update(text);
    encryptedData = Buffer.concat([encryptedData, cipheringData.final()])
    return encrypting.toString('hex') + ':' + encryptedData.toString('hex')
}

const decrypt = (text) => {
    const textArray = text.split(':');
    const encrypting = Buffer.from(textArray.shift(), 'hex');
    const encryptedText = Buffer.from(textArray.join(':'), 'hex');
    const decipheringText = crypto.createDecipheriv(algorithm, secretKey, encrypting);
    let decryptedText = decipheringText.update(encryptedText);
    decryptedText = Buffer.concat([decryptedText, decipheringText.final()])
    return decryptedText.toString();
}

CardSchema.pre('save', async function(next){
    const card = this;
    if(card.isModified('CardNumber')) {
        card.CardNumber = encrypt(card.CardNumber)
    }
    next();
})

CardSchema.methods.decryptCardNumber = function() {
    return decrypt(this.CardNumber);
};

module.exports = mongoose.model("Card-Detail", CardSchema);
