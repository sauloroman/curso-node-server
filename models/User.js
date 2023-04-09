const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

  username: {
    type: String,
    required: [ true, 'Username must be provided' ],
    maxlength: 60
  },

  email: {
    type: String,
    required: [ true, 'Email must be provided'],
    unique: true
  },

  password: {
    type: String,
    required: [ true, 'Password must be provided'],
    minlength: 6
  },

  img: {
    type: String,
  },

  role: {
    type: String,
    required: true,
    enum: ['ADMIN_ROLE', 'USER_ROLE']
  },

  isActive: {
    type: Boolean,
    default: true
  },

  google: {
    type: Boolean,
    default: false
  }

})

UserSchema.methods.toJSON = function() {
  const { password, __v, ...user } = this.toObject()
  return user
}

const User = mongoose.model('User', UserSchema )

module.exports = User