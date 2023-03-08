const express = require('express')
const app = express()
const port = process.env.PORT | 3000;
const db = require('./models');
const routes = require('./router/index')

app.use(express.urlencoded({extended: true}))
app.use(express.json());
//app.use(cors({origin:'*'}))

db.sequelize.authenticate().then(res => {
    console.log("db connected");
}).catch(err => {
    console.log("An error occured when connecting to db");
})

app.use('/api', routes)
app.listen(port, () => {
    console.log("Server running at " + port)
})