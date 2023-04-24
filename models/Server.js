const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const { dbConnection } = require('../database/config')

class Server {

  constructor() {
    this.app = express()
    this.port = process.env.PORT || 8080

    this.paths = {
      auth:       '/api/auth',
      categories: '/api/categories',
      products:   '/api/products',
      search:     '/api/search',
      users:      '/api/users',
      uploads:    '/api/uploads'
    }

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

    // Fileupload - Carga de archivos
    this.app.use( fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
      createParentPath: true
    }))

  }

  routes() {

    this.app.use( this.paths.auth , require('../routes/auth') )
    this.app.use( this.paths.categories , require('../routes/category') )
    this.app.use( this.paths.products , require('../routes/product') )
    this.app.use( this.paths.search, require('../routes/search'))
    this.app.use( this.paths.users , require('../routes/user') )
    this.app.use( this.paths.uploads, require('../routes/uploads') )

  }

  listen() {

    this.app.listen( this.port, () => {
      console.log(`Server running in port ${this.port}`)
    })

  }

}

module.exports = Server