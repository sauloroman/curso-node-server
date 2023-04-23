const { Router } = require('express')
const { check } = require('express-validator')

const router = Router()

const { 
  postCategory, getCategories, getCategory, putCategory, deleteCategory 
} = require('../controllers/category')

const { validateFields, validateJWT, hasRole } = require('../middlewares')
const { categoryExistenceById } = require('../helpers/db-validators')

// Obtener todas las categorias - publico
router.get('/', getCategories )

// Obtener una categoria - publico
router.get('/:id', [
  check('id', 'It is not a Mongo id valid').isMongoId(),
  check('id').custom( categoryExistenceById ),
  validateFields
], getCategory )

// Crear una nueva categoria - privado con cualquier rol
router.post('/', [
  validateJWT,
  check('name', 'Category Name is required').not().isEmpty(),
  validateFields
], postCategory )

// Crear una nueva categoria - privado con cualquier rol
router.put('/:id', [
  validateJWT,
  check('id', 'It is not a Mongo id valid').isMongoId(),
  check('id').custom( categoryExistenceById ),
  check('name', 'Category Name is required').not().isEmpty(),
  validateFields
], putCategory )

// Eliminar una categoria - privado solo si es admin
router.delete('/:id', [
  validateJWT,
  hasRole('ADMIN_ROLE'),
  check('id', 'It is not a Mongo id valid').isMongoId(),
  check('id').custom( categoryExistenceById ),
  validateFields
], deleteCategory )


module.exports = router