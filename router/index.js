const express = require('express');
const router = express.Router();
const Auth = require('../controller/auth/user.controller');
const User = require('../controller/user');
const Conn = require('../controller/user/conn.controller');
const UserM = require('../middlewares/user.middleware');
const Categories = require('../controller/categories/categoryController')

router.post('/register', Auth.register);
router.post('/confirm-otp', Auth.confirmOtpAndVerify);
router.post('/resend-otp', Auth.resendOtp);

router.get('/all-users', User.getAllUsers);

router.post('/connection-request', UserM.userMiddleware, Conn.newConnection);
router.get('/connection-request/get', UserM.userMiddleware, Conn.getMyConnectionRequests);
router.get('/sent-connection-requests/get', UserM.userMiddleware, Conn.getMySentConnectionRequests);
router.get('/connections', UserM.userMiddleware, Conn.myConnections);
router.post('/connection-request/accept', UserM.userMiddleware, Conn.acceptConnection);
router.post('/connection-request/reject', UserM.userMiddleware, Conn.rejectConnection);

//categories routes
router.post('/new-categories', Categories.createCategory)


module.exports = router