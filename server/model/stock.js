const mongoose = require( 'mongoose' )

const stock = new mongoose.Schema({
  producto: {type: String, required: true},
  tipo: String,
  material: String,
  talle: [Number],
  estilo: String,
  cantidad: Number,
  estante: String
})

mongoose.model('Stock',stock)