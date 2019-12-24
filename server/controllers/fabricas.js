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
      if(!results || results.length < 1){
        res.status(404).json({ message: "No se encontraron fabricas"})
      } else if (err) {
        res.status(404).json(err)
      } else {
        res.status(200).json(results)
      }
    })
}

//Obtengo una fabrica
module.exports.getFabrica = (req, res) => {
  //Controlamos que el id de la fabrica esté en el parámetro
  if (req.params && req.params.id) {
    Fabricas
      .findById(req.params.id)
      .exec((err, fabrica) => {
        //Si el id específico no existe en la BD
        if (!fabrica) {
          res.status(404).json({ message: "Id de fabrica no encontrado"})
        //Si la BD devuelve un error
        } else if (err) {
          res.status(404).json(err)
        } else {
            //Se devuelve el documento encontrado
            res.status(200).json(fabrica)
        }
    })
  } else {
    res.status(404).json({ message: "No se envió el id como parámetro"})
  }
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