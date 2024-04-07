const express = require("express")
const router = express.Router()
const Auth = require("../controller/auth/user.controller")
const User = require("../controller/user")
const Conn = require("../controller/user/conn.controller")
const UserM = require("../middlewares/user.middleware")
const Categories = require("../controller/categories/categoryController")
const Chat = require("../controller/chat/chat.controller")
const schemaMiddleware = require("../middlewares/schema.middleware")
const { updateUser, processContactsSchema } = require("../utilities/schemas")

router.post("/register", Auth.register)
router.post("/confirm-otp", Auth.confirmOtpAndVerify)
router.post("/resend-otp", Auth.resendOtp)

router.get("/all-users", User.getAllUsers)

router.post("/connection-request", UserM.userMiddleware, Conn.newConnection)
router.get(
  "/connection-request/get",
  UserM.userMiddleware,
  Conn.getMyConnectionRequests
)
router.get(
  "/sent-connection-requests/get",
  UserM.userMiddleware,
  Conn.getMySentConnectionRequests
)
router.get("/connections", UserM.userMiddleware, Conn.myConnections)
router.post(
  "/connection-request/accept",
  UserM.userMiddleware,
  Conn.acceptConnection
)
router.post(
  "/connection-request/reject",
  UserM.userMiddleware,
  Conn.rejectConnection
)
router.post("/connection/block", UserM.userMiddleware, Conn.blockConnection)

//categories routes
router.post("/new-categories", Categories.createCategory)
router.get("/category-per-user/:id", Categories.categoriesPerUser)
router.post("/chat-per-category", Categories.chatPerCategory)
router.delete("/delete-cart/:id", Categories.deleteCart)

//chats routes
router.post("/new-chat", Chat.newChat)
router.get("/get-chat/:connId", Chat.fetchChat)
router.post("/lastchat", Chat.lastChat)

//USER
router.post(
  "/process-contacts",
  UserM.userMiddleware,
  schemaMiddleware(processContactsSchema),
  Conn.processContacts
)
router.post(
  "/update-notification-token",
  UserM.userMiddleware,
  Auth.updateUserNotificationToken
)
router.get("/get-active-user", UserM.userMiddleware, User.getActiveUser)
router.get("/get-user", UserM.userMiddleware, User.getUser)
router.post(
  "/update-user",
  UserM.userMiddleware,
  schemaMiddleware(updateUser),
  User.updateUser
)
router.post("/delete-account", UserM.userMiddleware, User.deleteUser)

module.exports = router
