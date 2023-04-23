const { response } = require('express')
const { Product } = require("../models");

const getProducts = async ( req, res = response ) => {

  const { limit = 5, from = 0 } = req.query
  const query = { isActive: true }

  const [ quantityProducts, products ] = await Promise.all([
    Product.countDocuments(),
    Product.find( query )
      .populate('user', 'username')
      .populate('category', 'name')
      .skip( Number( from ) )
      .limit( Number( limit ) )
  ])

  res.status(200).json({
    quantityProducts,
    products
  })
    
}

const getProduct = async ( req, res = response ) => {

  const { id } = req.params

  const product = await Product.findById( id )
    .populate('user', 'username')
    .populate('category', 'name')

  res.status(201).json( product )

}

const createProduct = async( req, res = response ) => {

  const { isActive, user, ...restBody } = req.body

  const productDB = await Product.findOne({ name: restBody.name })

  if ( productDB ) {
    return res.status(400).json({
      msg: `Product ${restBody.name} already exist`
    })
  }
  
  const data = {
    ...restBody,
    name: restBody.name.toUpperCase(),
    user: req.user._id,
  }

  const product = new Product( data )
  await product.save()

  res.status(201).json( product )

} 

const updateProduct = async( req, res = response ) => {

  const {
    params: { id },
    body: { isActive, user, ...restBody }
  } = req

  if ( restBody.name ) {
    restBody.name = restBody.name.toUpperCase()
  }

  restBody.user = req.user._id

  const product = await Product.findOneAndUpdate( id, restBody, { new: true, runValidators: true })

  res.status(200).json( product )

}

const deleteProduct = async( req, res = response ) => {

  const { id } = req.params

  const product = await Product.findOneAndDelete( id, { isActive: false }, { new: true, runValidators: true })

  res.status(200).json( product )

}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
}