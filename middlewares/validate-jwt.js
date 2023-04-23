const { response } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const validateJWT = async ( req, res = response, next ) => {

  const token = req.header('x-token')
  
  if ( !token ) {
    return res.status(401).json({
      msg: 'There is no token in this request'
    })
  }

  try {

    const { uid } = jwt.verify( token, process.env.JWT_SECRET )
  
    // Obtener el usuario
    const user = await User.findById( uid )

    // User does not exist
    if ( !user ) {
      return res.status(401).json({ msg: 'Token is not valid - User does not exist'})
    }

    // Verificar que el usuario esta activo
    if ( !user.isActive ) {
      return res.status(401).json({ msg: 'Token is not valid - User is not active'})
    }

    req.user = user

    next()

  } catch( error ) {
    console.log( error )
    res.status(401).json({
      msg: 'Token is not valid'
    })
  }

}

module.exports = {
  validateJWT
}