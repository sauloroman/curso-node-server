const bcrypt = require('bcrypt')
const User = require("../models/User")
const { generateJWT } = require("../helpers/generate-jwt")
const { googleVerify } = require('../helpers/google-verify')

const login = async ( req, res ) => {
  
  const { email, password } = req.body

  try {

    // Verificar si el email existe
    const user = await User.findOne({ email })

    if ( !user ) {
      return res.status(404).json({
        msg: 'User / Password are not correct - Email does not exist'
      })
    }

    // Si el usuario esta activo
    if ( !user.isActive ) {
      return res.status(400).json({
        msg: 'User / Password are not correct - User no active'
      })
    }

    //  Verificar la contrasenia
    const validPassword = await bcrypt.compare( password, user.password )

    if ( !validPassword ) {
      return res.status(400).json({
        msg: 'User / Password are not correct - Wrong Password'
      })
    }

    // Generar el JWT
    const token = await generateJWT( user._id )

    res.json({
      user,
      token
    })

  } catch (error) {
    console.log( error )
    return res.status(500).json({ msg: 'Something went wrong '})
  }
  
}

const googleSignIn = async ( req, res = response ) => {

  const { id_token } = req.body

  try {

    const { name, email, picture } = await googleVerify( id_token )

    let user = await User.findOne({ email })

    if ( !user ) {
      // Crearlo
      const data = {
        username: name,
        email,
        password: 'Password no neccesary',
        img: picture,
        google: true,
        role: 'USER_ROLE'
      }

      user = new User( data )
      await user.save()

    }

    // Si el usuario en DB 
    if ( !user.isActive ) {
      return res.status(401).json({
        msg: 'Talk to administrator. User blocked'
      })
    }

    // Generar JWT
    const token = await generateJWT( user._id )

    res.json({
     user,
     token
    })

  } catch (error) {
    console.log( error )
    res.status(400).json({
      msg: 'Token was not verified'
    })
  }
  
}

module.exports = {
  login,
  googleSignIn
}