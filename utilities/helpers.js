require("dotenv").config()

module.exports = {
  ENV: (key, alt = "") => {
    return process.env[key] ?? alt
  },

  validationFails: (res, error) => {
    return res.status(422).json({
      message: error.message,
      success: false,
      error: error,
    })
  }
}
