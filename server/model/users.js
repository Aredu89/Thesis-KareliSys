const mongoose = require( 'mongoose' )

const permisos = new mongoose.Schema({
  home: {
    type: String,
    enum: [
      "",
      "LEER",
      "CREAR",
      "MODIFICAR"
    ],
    default: ""
  },
  fabricas: {
    type: String,
    enum: [
      "",
      "LEER",
      "CREAR",
      "MODIFICAR"
    ],
    default: ""
  },
  clientes: {
    type: String,
    enum: [
      "",
      "LEER",
      "CREAR",
      "MODIFICAR"
    ],
    default: ""
  },
  stock: {
    type: String,
    enum: [
      "",
      "LEER",
      "CREAR",
      "MODIFICAR"
    ],
    default: ""
  },
})

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
  permits: permisos,
  permitsAdmin: {
    type: Boolean,
    default: false,
    required: true
  }
})

mongoose.model('Usuarios', usuarios)