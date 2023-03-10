const express = require('express');
const router = express.Router();
const Auth = require('../controller/auth/user.controller');

router.post('/register', Auth.register);
router.post('/confirm-otp', Auth.confirmOtpAndVerify);
router.post('/resend-otp', Auth.resendOtp);

module.exports = router