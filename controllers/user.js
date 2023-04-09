const { response, request } = require('express')
const User = require('../models/User')
const bcrypt = require('bcrypt')

const getUsers = async ( req = request, res = response ) => {

  const { limit = 5, from = 0 } = req.query
  const query = { isActive: true }

  const [ quantityUser, users ] = await Promise.all([ 
    User.countDocuments( query ),
    User.find( query ).skip( Number( from ) ).limit( Number(limit) )
  ])

  res.status(200).json({ 
    quantityUser,
    users
 })
}

const postUsers = async ( req = request, res = response) => {

  const { username, email, password, role } = req.body
  const user = new User({ username, email, password, role })

  // Hashear contrasenia
  const salt = await bcrypt.genSalt( 10 )
  user.password = await bcrypt.hash( password, salt )

  // Guardar en DB
  await user.save()

  res.status(201).json(user)
}

const putUsers = async (req = request, res = response) => {

  const { 
    params: { id },
    body: { _id, password, google, email, ...restBody }
  } = req
  
  // TODO => VALIDAR CONTRA BASE DE DATOS
  
  if ( password ) {
    const salt = await bcrypt.genSalt( 10 )
    restBody.password = await bcrypt.hash( password, salt )
  }
  
  const user = await User.findOneAndUpdate( 
    { _id: id }, 
    restBody, 
    { new: true, runValidators: true }
  )

  res.status(200).json(user)
}

const patchUsers = (req, res = response ) => {
  res.json({ msg: 'Patch API - controller '})
}

const deleteUsers = async (req = request, res = response ) => {
  const { id } = req.params

  // ELIMINAR REALMENTE ***No recomendado. CUIDAR LA INTEGRIDAD REFERENCIAL
  // const user = await User.findOneAndDelete({ _id: id })

  // CAMBIAR EL ESTADO DEL USUARIO A NO ACTIVO ***Recomendado
  const user = await User.findOneAndUpdate(
    { _id: id }, 
    { isActive: false }, 
    { new: true, runValidators: true }
  )

  res.status( 200 ).json( user )
}

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers
}