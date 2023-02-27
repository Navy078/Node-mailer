const express = require('express')
let nunjucks = require('nunjucks')
const cookieParser = require("cookie-parser");

const homeRoute = require('./routes/home')
const registerRoute = require('./routes/registration')
const loginRoute = require('./routes/login')
const sendMail = require('./controllers/sendMail')

const { sequelize } = require('./models')

const PORT = 5000

const app = express()

app.use(cookieParser());


// To accept the data in json format
app.use(express.json())

app.set("view engine", "html")

nunjucks.configure(['templates/'], {
    autoescape: false,
    express: app
})


app.use('/', homeRoute)
app.use("/mail", sendMail.sendMail)

app.get('/register', registerRoute)
app.post('/register', registerRoute)
app.get('/login', loginRoute)
app.post('/login', loginRoute)
app.get('/logout', loginRoute)
app.get('/confirmation/:email', registerRoute)
app.get('/userInfo', homeRoute)
app.post('/userInfo', homeRoute)
app.get('/emaildata/:id', registerRoute)
app.get('/profile', homeRoute)
// app.use('/register', registerRoute)


app.listen({ port: PORT }, async () => {
    console.log(`Server started at http://localhost:${PORT}`);
    await sequelize.authenticate()
    console.log("Database synced!");
})
