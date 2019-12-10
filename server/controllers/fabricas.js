const mongoose = require('mongoose')
const Fabricas = mongoose.model('Fabricas')

//Obtengo el listado de fabricas
module.exports.listaFabricas = (req, res) => {
  // Para filtrar por algun parametro
  const filter = {}
  // if (req.query.status) filter.status = req.query.status
  Fabricas
    .find(filter)
    .exec((err, results, status) => {
      if(!results){
        res.status(404).json({ message: "No se encontraron fabricas"})
      } else if (err) {
        res.status(404).json(err)
      } else {
        res.status(200).json(results)
      }
    })
}

//Crear una fabrica
module.exports.crearFabrica = (req, res) => {
  const newFabrica = req.body
  newFabrica.creada = new Date()
  Fabricas
    .create(newFabrica, (err, fabrica) => {
      if(err) {
        res.status(400).json(err)
      } else {
        res.status(201).json(fabrica)
      }
    })
}