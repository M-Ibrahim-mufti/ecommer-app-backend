const CardDetail = require('../model/Card')

exports.addCardDetail = async(req,res) => {
    try {
        const [month, year] = req.body.card.Expiry.split('/');
        const reStatedExpiry = new Date(`${year}-${month}-01`)

        const cardDetails = new CardDetail({
            NameOnCard: req.body.card.HolderName,
            CardNumber: req.body.card.CardNumber,
            ExpiryDate: reStatedExpiry,
            Cvv: req.body.card.CVV,
            CardType: req.body.card.Type + 'Card',
            User: req.body.id,
        })
        const response = await cardDetails.save();
        console.log(response);
        res.status(200).json({message: "Details Entered Successfully"});
    } catch (error) {
        console.log(error);
    }
}

exports.getCardDetails = async(req,res) => {
    try {  
        const id = req.query.id;
        const details = await CardDetail.findOne({
            User: id
        })
        if(!details) {
            return res.status(402).json({message: "Update your payment details to easily access buy the products"})
        }
        const DecryptedCardNumber = details.decryptCardNumber();
        details.CardNumber = DecryptedCardNumber;
        res.status(200).json({details, message: "Details Found"});
    } catch(error) {

    }
    
}
