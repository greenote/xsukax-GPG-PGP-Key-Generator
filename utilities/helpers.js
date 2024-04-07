require("dotenv").config()

module.exports = {
  ENV: (key, alt = "") => {
    return process.env[key] ?? alt
  },
}
