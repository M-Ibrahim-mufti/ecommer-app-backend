const Reviews = require('../model/Reviews')

exports.addReviews = async(req,res) => {
    try{
        const review = await new Reviews(req.body)
        review.save()
        res.status(200).json({message:'Reviewed Successfully'})
    } catch(Err) {
        console.log(Err);
    }
}