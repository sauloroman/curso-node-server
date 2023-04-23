const { response } = require("express");
const { Category } = require("../models");

const getCategories = async ( req, res = response ) => {

  const { limit = 5, from = 0 } = req.query
  const query = { isActive: true }

  const [ quantityCategories, categories ] = await Promise.all([
    Category.countDocuments(),
    Category.find( query )
      .skip( Number( from ) )
      .limit( Number( limit ) ) 
      .populate('user', 'username')
  ])

  res.json({
    quantityCategories,
    categories
  })

}

const getCategory = async ( req, res = response ) => {
  const { id } = req.params
  const category = await Category.findById( id ).populate('user', 'username')
  res.status(200).json( category )
}

const postCategory = async( req, res = response ) => {

  const name = req.body.name.toUpperCase()

  const categoryDB = await Category.findOne({ name })

  // REVISAR QUE NO ESTE DUPLICADA EN LA BD
  if ( categoryDB ) {
    return res.status(400).json({
      msg: `Category ${ name } already exists`
    })
  }

  const data = {
    name,
    user: req.user._id
  }

  const category = new Category( data )
  await category.save()

  res.status(201).json( category )

}

const putCategory = async ( req, res = response ) => {

  const {
    params: { id },
    body: { isActive, user, ...data }
  } = req

  data.name = data.name.toUpperCase()
  data.user = req.user._id

  const category = await Category.findOneAndUpdate(
    { _id: id }, 
    data, 
    { new: true, runValidators: true }
  )

  res.status(200).json( category )

}

const deleteCategory = async ( req, res = response ) => {

  const { id } = req.params

  const category = await Category.findOneAndUpdate(
    { _id: id }, 
    { isActive: false }, 
    { new: true, runValidators: true }
  )

  res.status(200).json( category )

}

module.exports = {
  getCategories,
  getCategory,
  postCategory,
  putCategory,
  deleteCategory
}