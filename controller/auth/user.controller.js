const db = require("../../models")
const Joi = require("joi")
const { _sms } = require("../../utilities/bulksms")
const { validationFails } = require("../../utilities/requestVal")
const {
  userRegSchema,
  confirmOTP,
  phoneSc,
  nToken,
} = require("../../utilities/schemas")
const { ENV } = require("../../utilities/helpers")

const register = async (req, res) => {
  const {
    value: { name, phone },
    error,
  } = userRegSchema.validate(req.body)
  if (error) return validationFails(res, error)

  try {
    // check if user exist before
    const userExist = await db.User.findOne({ where: { phone } })

    if (userExist) {
      // if user exist, create otp and send sms
      const currentminute = new Date().getTime()
      const updatedObj = {
        token: Math.floor(Math.random() * 90000) + 10000,
        status: "unverified",
        expire_time: currentminute + 5 * 60000,
      }

      const response = await updateUserAndSMS(updatedObj, userExist)
      if (!response.success) {
        return res.status(500).json(response)
      }

      return res.status(200).json(response)
    }

    // create new acount if user does not exist before
    const newUser = await newAcct({ name, phone })
    if (!newUser.success) {
      return res.status(500).json(newUser)
    }

    return res.status(200).json(newUser)
  } catch (_error) {
    return res.status(500).json({
      message: "An error occured when trying to confirm user",
      success: false,
    })
  }
}

//new account methods
const newAcct = async ({ name, phone }) => {
  let response = {}

  const token = Math.floor(Math.random() * 90000) + 10000
  let currentDateObj = new Date()
  let currentminute = currentDateObj.getTime()
  let expire_time = currentminute + 5 * 60000

  await db.User.create({
    name,
    phone,
    expire_time,
    status: "unverified",
    token,
  })
    .then(async (_user) => {
      const smsResponse = await _sms({ phone, token })

      response = {
        success: true,
        message: "User Registration Successful",
        data: { phone, id: _user.id },
        smsResponse: smsResponse.message,
      }
    })
    .catch((_error) => {
      response = {
        success: false,
        message: "An error occured when inserting new user details",
      }
    })

  return response
}

const updateUserAndSMS = async (updatedObj, { id, phone }) => {
  let response = {}
  try {
    const user = await db.User.findOne({ where: id ? { id } : { phone } })
    if (!user) {
      return {
        message: "Can't find user details",
        success: false,
      }
    }
    user.phone != ENV("DEMO_PHONE") && user.set(updatedObj)
    await user
      .save()
      .then(async (_user) => {
        // send token through sms
        const smsResponse = await _sms({ phone, token: updatedObj.token })
        response = {
          success: true,
          message: `Welcome back`,
          smsResponse: smsResponse.message,
          data: { phone, id },
        }
      })
      .catch((_error) => {
        response = {
          message: "An error occured when trying to update user",
          success: false,
        }
      })
  } catch (error) {
    console.log(error)
    response = {
      message: "An error occured when trying to get user details",
      success: false,
    }
  }

  return response
}

// confirmation of otp###
const confirmOtpAndVerify = async (req, res) => {
  const {
    value: { otp, userId },
    error,
  } = confirmOTP.validate(req.body)
  if (error) return validationFails(res, error)

  //getting the current minute##
  let currentDateObj = new Date()
  let currentminute = currentDateObj.getTime()
  try {
    const user = await db.User.scope("withToken").findOne({
      where: { id: userId },
    })
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      })
    }

    if (user.token != otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        // message: user,
        success: false,
      })
    }

    if (
      currentminute > Number(user.expire_time) &&
      user.phone != ENV("DEMO_PHONE")
    ) {
      return res.status(400).json({
        message: "The (OTP) code has expired",
        success: false,
      })
    }

    user.set({ status: "verified" })
    return user
      .save()
      .then((user) => {
        user.token = null
        return res.status(200).json({
          data: user,
          message: "Account Verified Successfully",
          succuss: true,
        })
      })
      .catch((error) => {
        return res.status(200).json({
          success: false,
          message: "An error occured when marking user as verified",
        })
      })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "An error occured when confirming user details",
    })
  }
}

const resendOtp = async (req, res) => {
  const {
    value: { phone },
    error,
  } = phoneSc.validate(req.body)
  if (error) return validationFails(res, error)

  const currentminute = new Date().getTime()
  const updatedObj = {
    token: Math.floor(Math.random() * 90000) + 10000,
    status: "unverified",
    expire_time: currentminute + 5 * 60000,
  }

  const response = await updateUserAndSMS(updatedObj, { phone })
  if (!response.success) {
    return res.status(500).json(response)
  }

  return res.status(200).json(response)
}

const updateUserNotificationToken = async (req, res) => {
  const {
    value: { token },
    error,
  } = nToken.validate(req.body)
  if (error) return validationFails(res, error)

  // return await db.User.findOne({where: {id: req.user.userId}}).then(re => {
  // 	res.json({k: re})
  // })

  db.User.update({ nToken: token }, { where: { id: req.user.userId } })
    .then((user) => {
      return res.status(200).json({
        success: true,
        id: req.user.userId,
        user,
        message: "User Notification Token updated successfully",
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "Can't update user notification token",
      })
    })
}

module.exports = {
  register,
  confirmOtpAndVerify,
  resendOtp,
  updateUserNotificationToken,
}
