const jwt = require('jsonwebtoken')

const generateJWT = ( uid = '' ) => {
  return new Promise( ( resolve, reject ) => {

    const payload = { uid }

    jwt.sign( payload, process.env.JWT_SECRET, { expiresIn: '1d' }, ( err, token ) => {

      if ( err ) {
        console.log( err )
        reject( 'It was not possible to generate a json web token' )
      } else {
        resolve( token )
      }

    })

  })
}

module.exports = {
  generateJWT
}