const mongoose = require( 'mongoose' )

const stock = new mongoose.Schema({
  producto: {type: String, required: true},
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
  estante: String
})

mongoose.model('Stock',stock)