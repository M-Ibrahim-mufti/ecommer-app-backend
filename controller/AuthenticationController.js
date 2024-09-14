const Authentication = require('../model/Authentication');
const axios = require('axios');
const bcrypt = require('bcrypt');
const FormData = require('form-data');
const JWT = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config()


exports.SignUp = async(req,res) => {
    try{
        const email = req.body.email

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new Authentication({
            UserName: req.body.name,
            Email: req.body.email,
            Password: hashedPassword
        });

        const response = await user.save();
        const payload = {
            user_id: response._id,
            UserName: response.UserName,
            Email: response.Email,
            Role:response.Role
        }
        const accessToken = JWT.sign(payload,process.env.JWT_ACCESS_TOKEN, {expiresIn:'15min'})
        const refreshToken = JWT.sign(payload,process.env.JWT_REFRESH_TOKEN, {expiresIn:'1day'})

        res.cookie("AccessToken", accessToken, {maxAge: 15 * 60 * 1000, httpOnly:true, secure:true, sameSite:'lax'})
        res.cookie('RefreshToken', refreshToken, {maxAge: 24 * 60 * 60 * 1000, httpOnly:true, secure:true, sameSite:'lax'})
        res.status(201).json({success:true, user:payload, message:"Registered Successfully"})
    }
    catch(error) {
        res.status(402).json({message: "Could not save user for some reason"});
    }
}

exports.SignIn = async (req,res) => {
    try {
        const user = await Authentication.findOne({Email: req.body.email})
        const passwordValidation = await bcrypt.compare(req.body.password, user.Password );
        if (!passwordValidation) {
            return res.status(402).json({message: "Email or Password is Incorrect"})
        }
        const payload = {
            user_id: user._id,
            UserName: user.UserName,
            Email:user.Email,
            Role:user.Role
        }

        const accessToken = JWT.sign(payload,process.env.JWT_ACCESS_TOKEN, {expiresIn:'15min'})
        const refreshToken = JWT.sign(payload,process.env.JWT_REFRESH_TOKEN, {expiresIn:'1day'})

        res.cookie("AccessToken", accessToken, {maxAge: 15 * 60 * 1000, httpOnly:true, secure:true, sameSite:'lax'})
        res.cookie('RefreshToken', refreshToken, {maxAge: 24 * 60 * 60 *  1000, httpOnly:true, secure:true, sameSite:'lax'})
        res.json({success:true, user:payload, message:"Successfully Logged In"})
    } catch(error) {
        res.status(404).json({message:"User Not Found"})
    }

}

exports.refreshToken = async (req,res) => {
    const refreshToken = req.cookies.RefreshToken;
    const accessToken = req.cookies.AccessToken;
   
    if (accessToken) {
        const user = JWT.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
        const payload = {
            user_id: user.user_id,
            UserName: user.UserName,
            Email: user.Email,
            Role:user.Role
        }
        return res.json({user:payload, message:"token already exists", success:true});
    }
    if (!refreshToken && !accessToken) {
        return res.status(402).json({message:'no refresh token and access token found'});
    }
    
    const decoded = JWT.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
    const user = await Authentication.findOne(decoded._id);
    const payload = {
        user_id: user._id,
        UserName: user.UserName,
        Email: user.Email,
        Role: user.Role
    }

    const newAccessToken = JWT.sign(payload, process.env.JWT_ACCESS_TOKEN , {expiresIn:'15min'});

    res.cookie('AccessToken',newAccessToken,{maxAge: 15 * 60 * 1000, httpOnly:true, secure:true, sameSite:'lax'});
    res.status(200).json({ user:payload, success:true ,message:"updated Token successfully" });
}

exports.updateProfile = async (req, res) => {
    try{
        const userId = req.body._id
        const user = req.body
        const updateUser = await Authentication.findByIdAndUpdate(userId, user , {
            new:true,
            runValidators: true
        })

        const payload = {
            user_id: updateUser._id,
            UserName: updateUser.UserName,
            Email: updateUser.Email,
            Role: updateUser.Role
        }
    
        const newAccessToken = JWT.sign(payload, process.env.JWT_ACCESS_TOKEN, { expiresIn:'15min'})
        res.cookie('AccessToken', newAccessToken, {maxAge:15 * 60 * 1000, httpOnly:true, secure:true, sameSite:'lax'}) 
        if(!updateUser) {
            return res.status(400).json({message: 'No User found'})
        }
        res.status(200).json({message: 'user Update successfully'})
    } catch(err) {
        res.status(500).json({message: "Issue in editing the data"})
    }
}

exports.currentUserDetail = async (req,res) => {
    try {
        const id = req.query.id
        const user = await Authentication.findOne({
            _id: id 
        })
        res.status(201).json({ user ,message:"Date fetched Successfully"});
    } catch (err) {
        res.status(402).json({message: "Issue in fetching the data"});
    }
}

exports.uploadImage = async (req,res) => {
    const img = req.files.image;
    const cloudName = 'dbm5vfupw';
    const presetName = 'MyEcommerceWebsite'; 
    const formData = new FormData();
    try {
        formData.append('file', fs.createReadStream(img.tempFilePath));
        formData.append('upload_preset', presetName);
        formData.append('folder', 'Ecommerce-website')
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData)
        res.status(200).json(response.data.secure_url); 
    } catch (error) {
        res.status(200).json({message:"Error in uploading the Image"});
    }
}

exports.changePassword = async(req,res) => {
    try {
        const user = await Authentication.findOne({
            _id: req.body.id
        })
        if(!user) {
            return res.status(400).json({message:"User Not Fount"})
        }
        const passwordValidation = await bcrypt.compare(req.body.password.currentPassword, user.Password)
        if(!passwordValidation){
            return res.status(400).json({message: "Current Password is Incorrect"});
        }
        const checkPasswordSimilarity = await bcrypt.compare(req.body.password.newPassword, user.Password)
        if(checkPasswordSimilarity) {
            return res.status(400).json({message: 'Current password can not be new password'});
        }
        const newPassword = await bcrypt.hash(req.body.password.newPassword, 10);
        user.Password = newPassword;
        await user.save();
        return res.status(200).json({message: "Password Updated Successfully"});

    } catch (error) {

    }
}

exports.logout = async (req, res) => {
    res.clearCookie('AccessToken', {httpOnly:true, secure:true, sameSite:'lax'});
    res.clearCookie('RefreshToken', {httpOnly:true, secure:true, sameSite:'lax'});
    res.json({success:true, message:'Successfully Signed Out'})
}

exports.tokenCall = async(req,res) => {
    const AT = req.cookies?.AccessToken;
    console.log(AT)
}