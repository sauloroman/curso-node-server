const { Category, User, Role, Product } = require("../models")

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

const userExistenceById = async( id ) => {

  const userExists = await User.findById( id )

  if ( !userExists ) {
    throw new Error(`User with id ${ id } does not exist`)
  }

}

const categoryExistenceById = async ( id ) => {

  const categoryExists = await Category.findById( id )

  if ( !categoryExists ) {
    throw new Error(`Category with id ${ id } does not exist`)
  }

}

const productsExistenceById = async ( id ) => {

  const productExistence = await Product.findById( id )

  if ( !productExistence ) {
    throw new Error(`Product with id ${ id } does not exist`)
  }

}

module.exports = {
  isRoleValid,
  emailExistence,
  userExistenceById,
  categoryExistenceById,
  productsExistenceById
}