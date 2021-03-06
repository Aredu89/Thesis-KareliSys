const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
require('./model/db')
const passport = require("passport")

const apiRouter = require('./router/router')

app.use(express.static('static'))
app.use(bodyParser.json())

// Passport middleware
app.use(passport.initialize())

// Passport configuración
require("./config/passport")(passport);

app.use('/api', apiRouter)

app.get('*', (req, res) => {
  res.sendFile(path.resolve('static/index.html'))
})

app.listen(process.env.PORT || 3000, function () {
  console.log('App started on port 3000')
})