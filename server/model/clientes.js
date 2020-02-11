const mongoose = require( 'mongoose' )

const contactos = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: String,
  telefono: Number
})

const productosRef = new mongoose.Schema({
  nombre: String,
  talle: Number,
  cantidad: Number
})

const pagos = new mongoose.Schema({
  fecha: {type: Date, default: Date.now},
  monto: Number,
  formaPago: String,
  observaciones: String
})

const pedidos = new mongoose.Schema({
  fecha: {type: Date, default: Date.now},
  detalle: [productosRef],
  precioTotal: Number,
  estado: {type: String, enum:["pendiente","entregado"], default: "pendiente"}
})

const clientes = new mongoose.Schema({
  nombre: {type: String, required: true},
  direccion: String,
  ciudad: String,
  telefono: Number,
  contactos: [contactos],
  pedidos: [pedidos],
  creada: {type: Date, default: Date.now},
  pagos: [pagos]
})

mongoose.model('Clientes', clientes)