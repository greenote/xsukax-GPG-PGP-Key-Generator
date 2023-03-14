const express = require('express');
const router = express.Router();
const Auth = require('../controller/auth/user.controller');
const Conn = require('../controller/user/conn.controller');
const UserM = require('../middlewares/user.middleware');

router.post('/register', Auth.register);
router.post('/confirm-otp', Auth.confirmOtpAndVerify);
router.post('/resend-otp', Auth.resendOtp);

router.post('/connection-request', UserM.userMiddleware, Conn.newConnection);
router.get('/connection-request/get', UserM.userMiddleware, Conn.getMyConnectionRequests);
router.get('/connections', UserM.userMiddleware, Conn.myConnections);
router.post('/connection-request/accept', UserM.userMiddleware, Conn.acceptConnection);

module.exports = router