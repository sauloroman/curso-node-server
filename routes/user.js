const { Router } = require('express')
const router = Router()
const { 
  getUsers, 
  postUsers, 
  putUsers, 
  deleteUsers, 
  patchUsers } = require('../controllers/user')
const { check } = require('express-validator')
const { validateFields } = require('../middlewares/validate-fields')
const { isRoleValid, emailExistence, userExistence } = require('../helpers/db-validators')

router.get('/', getUsers )

router.post('/', [
  check('email', 'Email is not valid').isEmail(),
  check('email').custom( emailExistence ),
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password must be longer than 6 characters').isLength({ min: 6 }),
  // check('role', 'Rol not allowed').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('role').custom( isRoleValid ),
  validateFields
], postUsers )

router.put('/:id', [
  check('id', 'It is not a valid id').isMongoId(),
  check('id').custom( userExistence ),
  check('role').custom( isRoleValid ),
  validateFields
], putUsers )

router.patch('/', patchUsers )

router.delete('/:id', [
  check('id', 'It is not a valid id').isMongoId(),
  check('id').custom( userExistence ),
  validateFields,
], deleteUsers )



module.exports = router