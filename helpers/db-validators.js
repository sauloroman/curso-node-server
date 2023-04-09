const Role = require("../models/Role")
const User = require("../models/User")

const isRoleValid = async (role = '') => {

  const roleExistence = await Role.findOne({ role })

  if ( !roleExistence ) {
    // Este error no rompe la aplicacion. Es atrapado por el custom y lo agrega al arreglo de los errores que registra express-validators
    throw new Error(`Role ${role} is not in database`)
  }

}

const emailExistence = async ( email ) => {

  const emailExists = await User.findOne({ email })

  if ( emailExists ) {
    throw new Error('Email already exists')
  }

}

const userExistence = async( id ) => {

  const userExists = await User.findById( id )

  if ( !userExists ) {
    throw new Error(`User with id ${ id } does not exist`)
  }

}

module.exports = {
  isRoleValid,
  emailExistence,
  userExistence
}