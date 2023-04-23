const { response } = require("express");
const { ObjectId } = require('mongoose').Types

const { User, Product, Category } = require("../models");

const collectionsAllowed = [
  'users',
  'categories',
  'products',
  'products-category'
]

const searchUsers = async ( term = '', res = response ) => {

  const isMongoId = ObjectId.isValid( term )

  // BUSQUEDA POR ID 
  if ( isMongoId ) {
    const user = await User.findById( term )
    return res.status(200).json({
      results: ( user ? [ user ] : [] )
    })
  }

  // BUSQUEDA POR NOMBRE
  const regex = new RegExp( term, 'i' )

  const users = await User.find({ 
    $or: [{ username: regex }, { email: regex }],
    $and: [{ isActive: true }]
  })

  res.status(200).json({
    results: users
  })
}

const searchCategories = async ( term = '', res ) => {

  const isMongoId = ObjectId.isValid( term )

  if ( isMongoId ) {
    const category = await Category.findById( term )
    return res.status( 200 ).json({
      results: ( category ? [ category ] : [])
    })
  }

  const regex = new RegExp( term, 'i' )
  const categories = await Category.find({ name: regex, isActive: true })

  res.status(200).json({
    results: categories
  })
}

const searchProducts = async ( term = '', res ) => {

  const isMongoId = ObjectId.isValid( term )

  if ( isMongoId ) {
    const product = await Product.findById( term ).populate('category', 'name')
    return res.status( 200 ).json({
      results: ( product ? [ product ] : [])
    })
  }

  const regex = new RegExp( term, 'i' )
  const products = await Product.find({ name: regex, isActive: true }).populate('category', 'name')

  res.status(200).json({
    results: products
  })
}

const searchProductsCategory = async ( term = '', res = response ) => {

  const isMongoId = ObjectId.isValid( term )

  if ( isMongoId ) {
    const products = await Product.find({ category: new ObjectId( term ), isActive: true })
      .populate('category', 'name')
    return res.status(200).json({ results: products })
  }

  const regex = new RegExp( term, 'i' )

  const categories = await Category.find({ name: regex, isActive: true })

  if ( !categories.length ) {
    return res.status(400).json({
      msg: `There is no results with ${term} search term`
    })
  }

  const products = await Product.find({
    $or: [ ...categories.map( cate => ({ category: cate._id }) ) ],
    $and: [{ isActive: true }]
  })
  .populate('category', 'name')

  res.status(200).json({ results: products })

}

const search = ( req, res = response ) => {

  const { collection, term } = req.params

  if ( !collectionsAllowed.includes( collection ) ) {
    return res.status(400).json({
      msg: `Collections allowed are: ${collectionsAllowed}`
    })
  }

  switch( collection ) {

    case 'users':
      searchUsers( term, res )
      break;
    
    case 'categories':
      searchCategories( term, res )
      break;

    case 'products':
      searchProducts( term, res )
      break;
    
    case 'products-category': 
      searchProductsCategory( term, res )
      break

    default:
      res.status(500).json({
        msg: 'Collection is not working correctly'
      })
    break

  }

}

module.exports = {
  search
}