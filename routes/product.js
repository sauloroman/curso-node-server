const express = require('express')
const { check } = require('express-validator')

const { 
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product')

const { productsExistenceById, categoryExistenceById } = require('../helpers/db-validators')
const { validateJWT, validateFields, hasRole } = require('../middlewares')

const router = express.Router()

router.get('/', getProducts )

router.get('/:id', [
  check('id', 'It is not a Mongo id valid').isMongoId(),
  check('id').custom( productsExistenceById ),
  validateFields
], getProduct )

router.post('/', [
  validateJWT,
  check('name', 'Product Name is required').not().isEmpty(),
  check('category', 'It is not a Mongo id valid').isMongoId(),
  check('category').custom( categoryExistenceById ),
  validateFields
], createProduct )


router.put('/:id', [
  validateJWT,
  check('id', 'It is not a Mongo id valid').isMongoId(),
  check('id').custom( productsExistenceById ),
  validateFields
], updateProduct )

router.delete('/:id', [
  validateJWT,
  hasRole('ADMIN_ROLE'),
  check('id', 'It is not a Mongo id valid').isMongoId(),
  check('id').custom( productsExistenceById ),
  validateFields
], deleteProduct )

module.exports = router