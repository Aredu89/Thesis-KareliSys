const mongoose = require( 'mongoose' )

const stock = new mongoose.Schema({
  producto: {type: String, unique: true, required: true},
  tipo: String,
  material: String,
  talle: Number,
  estilo: String,
  cantidad: Number,
  estante: String
})

mongoose.model('Stock',stock)