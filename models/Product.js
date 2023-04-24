const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [ true, 'Product name is required'],
    unique: true
  }, 

  isActive: {
    type: Boolean,
    default: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  price: {
    type: Number,
    default: 0
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },

  description: {
    type: String
  },

  available: {
    type: Boolean,
    default: true
  },

  img: {
    type: String
  }

})

ProductSchema.methods.toJSON = function() {

  const { __v, isActive, ...data } = this.toObject()
  return data

}

const Product = mongoose.model('Product', ProductSchema )

module.exports = Product