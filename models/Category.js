const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({

  name: {
    type: String,
    required: [ true, 'Name is required'],
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
  }

})

CategorySchema.methods.toJSON = function() {
  const { __v, isActive, ...data} = this.toObject()
  return data
}

const Category = mongoose.model('Category', CategorySchema )

module.exports = Category