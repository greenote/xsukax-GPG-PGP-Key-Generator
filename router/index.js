const express = require('express');
const router = express.Router();
const Auth = require('../controller/auth/registration')


router.post('/register', Auth.register);
router.post('/check_otp', Auth.confirmOtp)
router.post('/resend_otp', Auth.resendOtp)

module.exports = router

