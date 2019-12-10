const mongoose = require('mongoose')
//Función para desconectar la base de datos
const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close( () => {
      console.log('Mongoose disconnected through ' + msg)
      callback()
  })
}

let dbURI = 'mongodb://localhost/issuetracker'
// URL para la base en el servidor
dbURI = 'mongodb://u0haubzbiwyypyf1u8mj:4oEskTsSYoIIVJ2kyvKb@bvoayqrxz5wsvwp-mongodb.services.clever-cloud.com:27017/bvoayqrxz5wsvwp'

mongoose.connect(dbURI,{ useNewUrlParser: true })

//Simulacion de evento SIGINT
const readLine = require ("readline")
if (process.platform === "win32"){
    var rl = readLine.createInterface ({
        input: process.stdin,
        output: process.stdout
    })
    rl.on ("SIGINT", () => {
        process.emit ("SIGINT")
    })
}

process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2')
    })
})

//Terminar la conexión con el evento SIGINT
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0)
    })
})

//Desconectar la bb dd con el evento de Heroku
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0)
    })
})

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ' + dbURI)
})
mongoose.connection.on('error',(err) => {
    console.log('Mongoose connection error: ' + err)
})
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected')
})

require('./fabricas.js')