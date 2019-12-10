const mongoose = require( 'mongoose' )

const contactos = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: String,
  telefono: Number
})

const productosRef = new mongoose.Schema({
  idProducto: {type: mongoose.Schema.Types.ObjectId, ref: 'productos'},
  cantidad: Number
})

const pedidos = new mongoose.Schema({
  numero: Number,
  detalle: [productosRef],
  precioTotal: Number,
  estado: {type: String, enum:["a pagar","pagado"], default: "a pagar"},
  pagado: Number
})

const fabricas = new mongoose.Schema({
  nombre: {type: String, required: true},
  direccion: String,
  telefono: Number,
  contactos: [contactos],
  pedidos: [pedidos],
  creada: {type: Date, default: Date.now}
})

mongoose.model('Fabricas', fabricas)