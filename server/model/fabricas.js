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
  monto: Number
})

const pedidos = new mongoose.Schema({
  numero: Number,
  fecha: {type: Date, default: Date.now},
  detalle: [productosRef],
  precioTotal: Number,
  estado: {type: String, enum:["a pagar","pago parcial","pagado"], default: "a pagar"}
})

const fabricas = new mongoose.Schema({
  nombre: {type: String, required: true},
  direccion: String,
  ciudad: String,
  telefono: Number,
  contactos: [contactos],
  pedidos: [pedidos],
  creada: {type: Date, default: Date.now},
  pagos: [pagos]
})

mongoose.model('Fabricas', fabricas)