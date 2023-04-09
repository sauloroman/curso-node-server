const { response } = require('express')

const getUsers = ( req, res = response ) => {

  const { apiKey, q, nombre, page = 1, limit = 10 } = req.query

  res.json({ 
    msg: 'Get API - controller',
    q, apiKey,nombre, page, limit
 })
}

const postUsers = (req, res = response) => {

  const { username, age } = req.body

  res.status(201).json({ 
    msg: 'Post API - controller',
    username,
    age
  })
}

const putUsers = (req, res = response) => {

  const { id } = req.params

  res.json({ 
    msg: 'Put API - controller',
    id
  })
}

const patchUsers = (req, res = response ) => {
  res.json({ msg: 'Patch API - controller '})
}

const deleteUsers = (req, res = response ) => {
  res.json({ msg: 'Delete API = controller '})
}

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers
}