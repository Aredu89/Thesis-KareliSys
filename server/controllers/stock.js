const mongoose = require('mongoose')
const Stock = mongoose.model('Stock')

//Obtengo el listado de stock
module.exports.listaStock = (req, res) => {
  // Para filtrar por algun parametro
  const filter = {}
  // if (req.query.status) filter.status = req.query.status
  Stock
    .find(filter)
    .exec((err, results, status) => {
      if(!results || results.length < 1){
        res.status(200).json([])
      } else if (err) {
        res.status(404).json(err)
      } else {
        res.status(200).json(results)
      }
    })
}

//Obtengo el listado de stock
module.exports.getCantidadStock = (req, res) => {
  // Para filtrar por algun parametro
  const filter = {}
  // if (req.query.status) filter.status = req.query.status
  Stock
    .find(filter)
    .exec((err, results, status) => {
      if(!results || results.length < 1){
        res.status(200).json({ cantidadStock: 0 })
      } else if (err) {
        res.status(404).json(err)
      } else {
        let cantidad = 0
        results.forEach(stock=>{
          cantidad = cantidad + stock.cantidad
        })
        res.status(200).json({ cantidadStock: cantidad })
      }
    })
}

//Obtengo un stock
module.exports.getStock = (req, res) => {
  //Controlamos que el id del stock esté en el parámetro
  if (req.params && req.params.id) {
    Stock
      .findById(req.params.id)
      .exec((err, stock) => {
        //Si el id específico no existe en la BD
        if (!stock) {
          res.status(404).json({ message: "Id de stock no encontrado"})
        //Si la BD devuelve un error
        } else if (err) {
          res.status(404).json(err)
        } else {
            //Se devuelve el documento encontrado
            res.status(200).json(stock)
        }
    })
  } else {
    res.status(404).json({ message: "No se envió el id como parámetro"})
  }
}

//Crear un stock
module.exports.crearStock = (req, res) => {
  const newStock = req.body
  Stock
    .create(newStock, (err, stock) => {
      if(err) {
        res.status(400).json(err)
      } else {
        res.status(201).json(stock)
      }
    })
}

//Modificar una stock
module.exports.modificarStock = (req,res) => {
  if (!req.params.id) {
    res.status(404).json({ message: "Se requiere el id del stock"})
    return
  }
  const auxStock = req.body
  Stock
    .findById(req.params.id)
    .select('-creada')
    .exec(
      (err,stock) => {
        if (!stock) {
          res.status(404).json({ message: "No se encontró el id de la fábrica"})
          return
        } else if (err) {
          res.status(404).json(err)
          return
        }
        //Si no hay error, reemplazo con los datos del body
        stock._id = auxStock._id
        stock.estado = auxStock.estado
        stock.producto = auxStock.producto
        stock.tipo = auxStock.tipo
        stock.material = auxStock.material
        stock.talle = auxStock.talle
        stock.estilo = auxStock.estilo
        stock.cantidad = auxStock.cantidad
        stock.estante = auxStock.estante
        stock.save((err, stock) => {
          if (err) {
            res.status(404).json(err)
          } else {
            res.status(201).json(stock)
          }
        })
      }
    )
}

//Eliminar un stock
module.exports.eliminarStock = (req,res) => {
  if (!req.params.id) {
    res.status(404).json({ message: "Se requiere el id del stock"})
    return
  }
  Stock
    .findByIdAndRemove(req.params.id)
    .exec(
      (err, stock) => {
        if(err){
          res.status(404).json(err)
        } else {
          res.status(204).json(null)
        }
      }
    )
}