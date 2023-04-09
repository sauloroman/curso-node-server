const { Router } = require('express')
const router = Router()
const { 
  getUsers, 
  postUsers, 
  putUsers, 
  deleteUsers, 
  patchUsers } = require('../controllers/user')

router.get('/', getUsers )

router.post('/', postUsers )

router.put('/:id', putUsers )

router.patch('/', patchUsers )

router.delete('/', deleteUsers )



module.exports = router