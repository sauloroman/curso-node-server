const { Router } = require('express')
const { check } = require('express-validator')

const router = Router()

const { 
  getUsers, 
  postUsers, 
  putUsers, 
  deleteUsers } = require('../controllers/user')

const { 
  validateFields, 
  validateJWT, 
  hasRole } = require('../middlewares')

const { 
  isRoleValid, 
  emailExistence, 
  userExistenceById } = require('../helpers/db-validators')

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
  check('id').custom( userExistenceById ),
  check('role').custom( isRoleValid ),
  validateFields
], putUsers )

router.delete('/:id', [
  validateJWT, 
  // isAdminRole,
  hasRole('ADMIN_ROLE', 'USER_ROLE', 'SALES_ROLE'),
  check('id', 'It is not a valid id').isMongoId(),
  check('id').custom( userExistenceById ),
  validateFields,
], deleteUsers )



module.exports = router