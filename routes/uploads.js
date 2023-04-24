const { Router } = require('express')
const { check } = require('express-validator')

const { validateFields, validateFile } = require('../middlewares')

const { loadFile, updateFile, showImage, updateFileCloudinary } = require('../controllers/uploads')
const { validateAllowedCollections } = require('../helpers')

const router = Router()

router.post('/', validateFile, loadFile )

router.get('/:collection/:id', [
  check('id', 'It is not a valid MongoID').isMongoId(),
  check('collection').custom( collection => validateAllowedCollections( collection, ['users', 'products'] )),
  validateFields
], showImage )

router.put('/:collection/:id', [
  validateFile,
  check('id', 'It is not a valid MongoID').isMongoId(),
  check('collection').custom( collection => validateAllowedCollections( collection, ['users', 'products'] ) ),
  validateFields
], updateFileCloudinary )
// ], updateFile )

module.exports = router