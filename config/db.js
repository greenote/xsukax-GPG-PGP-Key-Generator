require('dotenv').config()
const mysql = require('mysql')

const conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: "", 
  database: process.env.DATABASE,
})

module.exports = conn