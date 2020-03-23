const mongoose = require( 'mongoose' )

const usuarios = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  permits: {
    type: Boolean,
    required: false,
    default: false
  }
})

mongoose.model('Usuarios', usuarios)