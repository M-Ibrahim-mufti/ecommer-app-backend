const express = require('express');
const router = express.Router();
const AuthenticationController = require('../controller/AuthenticationController');
const VerifyUser = require('../utilities/AuthUtilities');

router.post('/SignUp', AuthenticationController.SignUp);
router.post('/SignIn', AuthenticationController.SignIn);
router.get('/token-refresh',AuthenticationController.refreshToken);
router.post('/logout',VerifyUser, AuthenticationController.logout);
router.get('/userdetail',VerifyUser, AuthenticationController.currentUserDetail);
router.post('/user/Upload-Image',VerifyUser, AuthenticationController.uploadImage);
router.put('/user/update-profile',VerifyUser, AuthenticationController.updateProfile);
router.put('/user/change-password',VerifyUser, AuthenticationController.changePassword);
router.post('/token-call',AuthenticationController.tokenCall )

module.exports = router