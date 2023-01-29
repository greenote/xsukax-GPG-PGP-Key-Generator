const express  = require('express')
const app = express()
const port = process.env.PORT | 300;
const conn = require('./config/db')
const routes = require('./router/index') 

app.use(express.urlencoded({extended:true}))
app.use(express.json());
//app.use(cors({origin:'*'}))

conn.connect((err)=>{
    err ? console.log(err) : console.log("database is connected")
})

app.use('/api', routes)
app.listen(port, ()=>{
    console.log("serve start runing " + port)
})