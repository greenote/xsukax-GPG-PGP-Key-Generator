const express = require('express');
const router = express.Router();
const Auth = require('../controller/auth/user.controller');
const Conn = require('../controller/user/conn.controller');
const UserM = require('../middlewares/user.middleware');

router.post('/register', Auth.register);
router.post('/confirm-otp', Auth.confirmOtpAndVerify);
router.post('/resend-otp', Auth.resendOtp);

router.post('/connection-request', UserM.userMiddleware, Conn.newConnection);
router.post('/connection-request/get', UserM.userMiddleware, Conn.getMyConnectionRequests);

module.exports = router