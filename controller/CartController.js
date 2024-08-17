const cart = require('../model/Cart');

exports.addToCart = async(req,res) => {
    try{
        const addToCart = new cart(req.body);
        await addToCart.save();
        const getCheckOut = await cart.find({User: req.body.User});
        res.status(200).json({totalCheckoutProduct:getCheckOut.length, message:'Successfully added to checkout'})

    } catch(err) {
        res.status(400)
    }
}

exports.getAllCartProduct = async (req,res) => {
    try {
        const getCart = await cart.find({
            User:req.query.id
        })
        res.status(200).json({totalNumberOfUserProductCarted:getCart.length, totalUserProductCarted:getCart})
    } catch(err) {
        res.status(400)
    }
}

exports.RemoveFromCart = async(req,res) => {
    try {
        const deletedProduct = await cart.findByIdAndDelete(req.params.id);
        if(!deletedProduct) {
            return res.status(404).json({message:'product not found'});
        }
        const carted = await cart.find();
        res.status(200).json({totalNumberOfUserProductCarted:carted.length} )
    } catch(err) {
        res.status(400)
    }
}