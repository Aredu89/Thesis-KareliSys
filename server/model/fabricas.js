const mongoose = require( 'mongoose' )

const contactos = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: String,
  telefono: Number
})

const productos = new mongoose.Schema({
  nombre: String,
  talles: [Number]
})

const pagos = new mongoose.Schema({
  fecha: {type: Date, default: Date.now},
  monto: Number,
  formaPago: String,
  factura: Number,
  observaciones: String
})

const detalle = new mongoose.Schema({
  producto: String,
  talle: Number,
  cantidad: Number
})

const pedidos = new mongoose.Schema({
  fechaPedido: {type: Date, default: Date.now},
  fechaEntrega: Date,
  fechaEntregado: Date,
  detalle: [detalle],
  enStock: Boolean,
  precioTotal: Number,
  pagos: [pagos],
  estado: {type: String,
    enum:["pendiente","aprobado","pagado","entregado","finalizado","cancelado"],
    default: "pendiente"}
})

const fabricas = new mongoose.Schema({
  nombre: {type: String, required: true},
  direccion: String,
  ciudad: String,
  telefono: Number,
  productos: [productos],
  contactos: [contactos],
  pedidos: [pedidos],
  creada: {type: Date, default: Date.now},
})

mongoose.model('Fabricas', fabricas)