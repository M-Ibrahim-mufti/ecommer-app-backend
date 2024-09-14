const VerifyUser = (req,res,next) =>{
    try {
        const AT = req.cookies.AccessToken
        console.log(AT)
        if(!AT) {
            return res.status(404).json({message: 'Session Expired'})
        }
        req.headers['Authorization'] = `Bearer ${AT}`;
        next();

    } catch(err) {
        console.log(err)
    }
}

module.exports = VerifyUser