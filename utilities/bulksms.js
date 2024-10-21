require("dotenv").config()
const axios = require("axios")
const { EBULKSMS_USERNAME, EBULKSMS_APIKEY } = process.env

async function _sms(data) {
  try {
    const config = {
      method: "post",
      url: "https://api.ebulksms.com/sendsms.json",
      data: {
        SMS: {
          auth: {
            username: `${EBULKSMS_USERNAME}`,
            apikey: `${EBULKSMS_APIKEY}`,
          },
          message: {
            sender: "Greenote",
            messagetext: `Welcome ${data.token} is your Greenote verification code.`,
            flash: "0",
          },
          recipients: {
            gsm: {
              msidn: `${data.phone}`,
              msgid: "Otp",
            },
          },
          dndsender: 1,
        },
      },
    }
    const bulkRes = await axios(config)
    let _smsRes = bulkRes.data
    if (_smsRes.response.status == "SUCCESS") {
      return {
        message: "Your One time password(OTP) has been sent to you",
        success: true,
      }
    } else {
      return {
        message: "Couldn't send OTP",
        success: false,
      }
    }
  } catch (error) {
    return {
      message: error?.message ? error.message : "Couldn't send OTP",
      success: false,
    }
  }
}

module.exports = { _sms }
