const mongoose = require('mongoose')
const Clientes = mongoose.model('Clientes')

//Obtengo el listado de fabricas
module.exports.listaClientes = (req, res) => {
  // Para filtrar por algun parametro
  const filter = {}
  // if (req.query.status) filter.status = req.query.status
  Clientes
    .find(filter)
    .exec((err, results, status) => {
      if(!results || results.length < 1){
        res.status(404).json({ message: "No se encontraron clientes"})
      } else if (err) {
        res.status(404).json(err)
      } else {
        res.status(200).json(results)
      }
    })
}

//Obtengo los ingresos del mes
module.exports.getIngresosMes = (req, res) => {
  // Para filtrar por algun parametro
  const filter = {}
  // if (req.query.status) filter.status = req.query.status
  Clientes
    .find(filter)
    .exec((err, results, status) => {
      if(!results || results.length < 1){
        res.status(404).json({ message: "No se encontraron clientes"})
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
        let ingresos = 0
        results.forEach(cliente=>{
          cliente.pagos.forEach(pago=>{
            if(pago.fecha > desde && pago.fecha < hasta){
              ingresos = ingresos + pago.monto
            }
          })
        })
        res.status(200).json({ ingresosMes: ingresos })
      }
    })
}

//Obtengo una fabrica
module.exports.getCliente = (req, res) => {
  //Controlamos que el id de la fabrica esté en el parámetro
  if (req.params && req.params.id) {
    Clientes
      .findById(req.params.id)
      .exec((err, cliente) => {
        //Si el id específico no existe en la BD
        if (!cliente) {
          res.status(404).json({ message: "Id de cliente no encontrado"})
        //Si la BD devuelve un error
        } else if (err) {
          res.status(404).json(err)
        } else {
            //Se devuelve el documento encontrado
            res.status(200).json(cliente)
        }
    })
  } else {
    res.status(404).json({ message: "No se envió el id como parámetro"})
  }
}

//Crear una fabrica
module.exports.crearCliente = (req, res) => {
  const auxBody = req.body
  let newCliente = {}
  newCliente.creada = new Date()
  newCliente.nombre = auxBody.nombre
  newCliente.direccion = auxBody.direccion
  newCliente.ciudad = auxBody.ciudad
  newCliente.telefono = auxBody.telefono
  newCliente.contactos = auxBody.contactos ? auxBody.contactos.map(contacto=>{
    return {
      nombre: contacto.nombre,
      apellido: contacto.apellido,
      email: contacto.email,
      telefono: contacto.telefono
    }
  }) : []
  newCliente.pedidos = auxBody.pedidos ? auxBody.pedidos.map(pedido=>{
    return {
      fecha: pedido.fecha,
      detalle: pedido.detalle,
      precioTotal: pedido.precioTotal,
      estado: pedido.estado
    }
  }) : []
  newCliente.pagos = auxBody.pagos ? auxBody.pagos.map(pago=>{
    return {
      fecha: pago.fecha,
      monto: pago.monto,
      formaPago: pago.formaPago,
      observaciones: pago.observaciones
    }
  }) : []
  Clientes
    .create(newCliente, (err, cliente) => {
      if(err) {
        res.status(400).json(err)
      } else {
        res.status(201).json(cliente)
      }
    })
}

//Modificar una fabrica
module.exports.modificarCliente = (req,res) => {
  if (!req.params.id) {
    res.status(404).json({ message: "Se requiere el id del cliente"})
    return
  }
  const auxCliente = req.body
  Clientes
    .findById(req.params.id)
    .select('-creada')
    .exec(
      (err,cliente) => {
        if (!cliente) {
          res.status(404).json({ message: "No se encontró el id del cliente"})
          return
        } else if (err) {
          res.status(404).json(err)
          return
        }
        //Si no hay error, reemplazo con los datos del body
        cliente.nombre = auxCliente.nombre
        cliente.direccion = auxCliente.direccion
        cliente.ciudad = auxCliente.ciudad
        cliente.telefono = auxCliente.telefono
        cliente.contactos = auxCliente.contactos ? auxCliente.contactos.map(contacto=>{
          return {
            nombre: contacto.nombre,
            apellido: contacto.apellido,
            email: contacto.email,
            telefono: contacto.telefono
          }
        }) : []
        cliente.pedidos = auxCliente.pedidos ? auxCliente.pedidos.map(pedido=>{
          return {
            fecha: pedido.fecha,
            detalle: pedido.detalle,
            precioTotal: pedido.precioTotal,
            estado: pedido.estado
          }
        }) : []
        cliente.pagos = auxCliente.pagos ? auxCliente.pagos.map(pago=>{
          return {
            fecha: pago.fecha,
            monto: pago.monto,
            formaPago: pago.formaPago,
            observaciones: pago.observaciones
          }
        }) : []
        cliente.save((err, cliente) => {
          if (err) {
            res.status(404).json(err)
          } else {
            res.status(201).json(cliente)
          }
        })
      }
    )
}

//Eliminar una fabrica
module.exports.eliminarCliente = (req,res) => {
  if (!req.params.id) {
    res.status(404).json({ message: "Se requiere el id del cliente"})
    return
  }
  Clientes
    .findByIdAndRemove(req.params.id)
    .exec(
      (err, cliente) => {
        if(err){
          res.status(404).json(err)
        } else {
          res.status(204).json(null)
        }
      }
    )
}