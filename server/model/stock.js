const mongoose = require( 'mongoose' )

const stock = new mongoose.Schema({
  producto: String,
  estado: {
    type: String,
    enum:["pendiente","fisico"],
    default: "pendiente"
  },
  tipo: String,
  material: String,
  talle: Number,
  estilo: String,
  cantidad: Number,
  estante: String,
  fabrica: String
})

//Combinación de campos únicos producto/talle
stock.index({producto: 1, talle: 1, fabrica: 1}, {unique: true})

mongoose.model('Stock',stock)