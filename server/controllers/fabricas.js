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

//Obtengo los egresos del mes
module.exports.getEgresosMes = (req, res) => {
  // Para filtrar por algun parametro
  const filter = {}
  Fabricas
    .find(filter)
    .exec((err, results, status) => {
      if(!results || results.length < 1){
        res.status(404).json({ message: "No se encontraron fabricas"})
      } else if (err) {
        res.status(404).json(err)
      } else {
        //Obtengo el dia 1 del mes actual y del siguiente
        const ahora = new Date()
        const año = ahora.getFullYear()
        const mes = ahora.getMonth()
        const mesSiguiente = mes === 11 ? 0 : mes + 1
        const desde = new Date(año, mes, 1)
        const hasta = new Date(año, mesSiguiente, 1)
        let egresos = 0
        results.forEach(fabrica=>{
          fabrica.pagos.forEach(pago=>{
            if(pago.fecha > desde && pago.fecha < hasta){
              egresos = egresos + pago.monto
            }
          })
        })
        res.status(200).json({ egresosMes: egresos })
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
  const auxBody = req.body
  let newFabrica = {}
  newFabrica.creada = new Date()
  newFabrica.nombre = auxBody.nombre
  newFabrica.direccion = auxBody.direccion
  newFabrica.ciudad = auxBody.ciudad
  newFabrica.telefono = auxBody.telefono
  newFabrica.contactos = auxBody.contactos ? auxBody.contactos.map(contacto=>{
    return {
      nombre: contacto.nombre,
      apellido: contacto.apellido,
      email: contacto.email,
      telefono: contacto.telefono
    }
  }) : []
  newFabrica.pedidos = auxBody.pedidos ? auxBody.pedidos.map(pedido=>{
    return {
      fecha: pedido.fecha,
      detalle: pedido.detalle,
      precioTotal: pedido.precioTotal,
      estado: pedido.estado
    }
  }): []
  newFabrica.pagos = auxBody.pagos ? auxBody.pagos.map(pago=>{
    return {
      fecha: pago.fecha,
      monto: pago.monto,
      formaPago: pago.formaPago,
      observaciones: pago.observaciones
    }
  }) : []
  Fabricas
    .create(newFabrica, (err, fabrica) => {
      if(err) {
        res.status(400).json(err)
      } else {
        res.status(201).json(fabrica)
      }
    })
}

//Modificar una fabrica
module.exports.modificarFabrica = (req,res) => {
  if (!req.params.id) {
    res.status(404).json({ message: "Se requiere el id de la fábrica"})
    return
  }
  const auxFabrica = req.body
  Fabricas
    .findById(req.params.id)
    .select('-creada')
    .exec(
      (err,fabrica) => {
        if (!fabrica) {
          res.status(404).json({ message: "No se encontró el id de la fábrica"})
          return
        } else if (err) {
          res.status(404).json(err)
          return
        }
        //Si no hay error, reemplazo con los datos del body
        fabrica.nombre = auxFabrica.nombre
        fabrica.direccion = auxFabrica.direccion
        fabrica.ciudad = auxFabrica.ciudad
        fabrica.telefono = auxFabrica.telefono
        fabrica.contactos = auxFabrica.contactos ? auxFabrica.contactos.map(contacto=>{
          return {
            nombre: contacto.nombre,
            apellido: contacto.apellido,
            email: contacto.email,
            telefono: contacto.telefono
          }
        }) : []
        fabrica.pedidos = auxFabrica.pedidos ? auxFabrica.pedidos.map(pedido=>{
          return {
            fecha: pedido.fecha,
            detalle: pedido.detalle,
            precioTotal: pedido.precioTotal,
            estado: pedido.estado
          }
        }): []
        fabrica.pagos = auxFabrica.pagos ? auxFabrica.pagos.map(pago=>{
          return {
            fecha: pago.fecha,
            monto: pago.monto,
            formaPago: pago.formaPago,
            observaciones: pago.observaciones
          }
        }) : []
        fabrica.save((err, fabrica) => {
          if (err) {
            res.status(404).json(err)
          } else {
            res.status(201).json(fabrica)
          }
        })
      }
    )
}

//Eliminar una fabrica
module.exports.eliminarFabrica = (req,res) => {
  if (!req.params.id) {
    res.status(404).json({ message: "Se requiere el id de la fábrica"})
    return
  }
  Fabricas
    .findByIdAndRemove(req.params.id)
    .exec(
      (err, fabrica) => {
        if(err){
          res.status(404).json(err)
        } else {
          res.status(204).json(null)
        }
      }
    )
}