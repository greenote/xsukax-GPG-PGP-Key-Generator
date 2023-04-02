const express = require('express');
const app = express()
const port = process.env.PORT | 3500;
const db = require('./models');
const routes = require('./router/index')
const http = require("http");
const {Server} = require('socket.io');

app.use(express.urlencoded({extended: true}))
    .use(express.json())
    .use('/api', routes)

const server = http.createServer(app)
const io = new Server(server, {
    cors: {origin: '*'}
})

db.sequelize.authenticate().then(() => {
    console.log("db connected");
}).catch(err => {
    console.log("An error occured when connecting to db");
})

server.listen(port, () => {
    console.log("Server running at " + port)
})