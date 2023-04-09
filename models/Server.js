const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {

  constructor() {
    this.app = express()
    this.port = process.env.PORT || 8080
    this.usersPath = '/api/users'

    // CONEXION BASE DE DATOS
    this.connectDB()

    // MIDDLEWARES
    this.middlewares()

    // RUTAS DE LA APLICACION
    this.routes()
  }

  async connectDB() {
    await dbConnection()
  }

  middlewares() {

    // CORS 
    this.app.use( cors() )

    // Lectura y parseo de body
    this.app.use( express.json() )

    // Directorio publico
    this.app.use( express.static('./public') )

  }

  routes() {

    this.app.use( this.usersPath , require('../routes/user') )

  }

  listen() {

    this.app.listen( this.port, () => {
      console.log(`Server running in port ${this.port}`)
    })

  }

}

module.exports = Server