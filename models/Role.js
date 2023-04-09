const mongoose = require('mongoose')

const RoleSchema = new mongoose.Schema({

  role: {
    type: String,
    required: [ true, 'Role is required' ]
  }

})

const Role = mongoose.model('Role', RoleSchema )

module.exports = Role