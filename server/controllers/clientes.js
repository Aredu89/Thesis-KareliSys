const mongoose = require('mongoose')
const Clientes = mongoose.model('Clientes')
const Stock = mongoose.model('Stock')

//Obtengo el listado de fabricas
module.exports.listaClientes = (req, res) => {
  // Para filtrar por algun parametro
  const filter = {}
  // if (req.query.status) filter.status = req.query.status
  Clientes
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

//Obtengo los ingresos del mes
module.exports.getIngresosMes = (req, res) => {
  // Para filtrar por algun parametro
  const filter = {}
  const { desde, hasta } = req.query
  Clientes
    .find(filter)
    .exec((err, results, status) => {
      if(!results || results.length < 1){
        res.status(200).json({ ingresosMes: 0 })
      } else if (err) {
        res.status(404).json(err)
      } else {
        //Obtengo el dia 1 del mes actual y del siguiente
        const ahora = new Date()
        const año = ahora.getFullYear()
        const mes = ahora.getMonth()
        const mesSiguiente = mes === 11 ? 0 : mes + 1
        const desde1 = desde && hasta ? desde : new Date(año, mes, 1)
        const hasta1 = desde && hasta ? hasta : new Date(año, mesSiguiente, 1)
        let ingresos = 0
        if(results.length > 0){
          results.forEach(cliente=>{
            if(cliente.pedidos.length > 0){
              cliente.pedidos.forEach(pedido=>{
                if(pedido.pagos.length > 0){
                  pedido.pagos.forEach(pago=>{
                    if(pago.fecha > desde1 && pago.fecha < hasta1){
                      ingresos = ingresos + pago.monto
                    }
                  })
                }
              })
            }
          })
        }
        res.status(200).json({ ingresosMes: ingresos })
      }
    })
}

//Obtengo un cliente
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

//Crear un cliente
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
  newCliente.pedidos = []
  Clientes
    .create(newCliente, (err, cliente) => {
      if(err) {
        res.status(400).json(err)
      } else {
        res.status(201).json(cliente)
      }
    })
}

//Modificar un cliente
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

//Eliminar un cliente
module.exports.eliminarCliente = (req,res) => {
  if (!req.params.id) {
    res.status(404).json({ message: "Se requiere el id del cliente"})
    return
  }
  //Controlo si hay pedidos asociados al cliente
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
        if(cliente.pedidos.length > 0){
          res.status(404).json({ message: "No se puede eliminar un cliente con pedidos"})
        } else {
          //Elimino la fábrica
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
      }
    })
}

//Crear pedido
module.exports.crearPedido = (req,res) => {
  if (!req.params.id) {
    res.status(404).json({ message: "Se requiere el id del cliente"})
    return
  }
  const pedidoBody = req.body
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
        cliente.pedidos.push({
          fechaPedido: pedidoBody.fechaPedido,
          detalle: pedidoBody.detalle.map(det=>{
            return {
              producto: det.producto,
              talle: det.talle,
              cantidad: det.cantidad
            }
          }),
          pagos: [],
          estado: "pendiente"
        })
        //Guardo los cambios en BD
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

//Modificar pedido
module.exports.modificarPedido = (req,res) => {
  if (!req.params.id || !req.params.idPedido) {
    res.status(404).json({ message: "Se requiere el id del cliente y del pedido"})
    return
  }
  const pedidoBody = req.body
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
        //Defino el día de hoy
        const fechaHoy = new Date()
        //Defino si cambia el estado
        let estadoAux = "pendiente"
        if(
          pedidoBody.fechaEntrega &&
          pedidoBody.precioTotal
        ){
          estadoAux = "aprobado"
        }
        let sum = 0
        if(pedidoBody.pagos){
          pedidoBody.pagos.forEach(pago=>{
            sum = sum + Number(pago.monto)
          })
        }
        if(
          sum === pedidoBody.precioTotal
        ){
          estadoAux = "pagado"
        }
        const fechaEntregaDate = new Date(pedidoBody.fechaEntrega)
        if(
          fechaEntregaDate < fechaHoy
        ) {
          estadoAux = "demorado"
        }
        if(
          pedidoBody.fechaEntregado
        ){
          estadoAux = "entregado"
          //Quito los productos del stock, si existen en stock
          // const pedidoAModificar = cliente.pedidos.find(pedido=> pedido._id.toString() === pedidoBody._id.toString())
          // if(pedidoAModificar){
          //   console.log("Pedido a modificar: ", pedidoAModificar)
          //   if(!pedidoAModificar.quitadoDeStock){
          //     pedidoBody.quitadoDeStock = true
          //     pedidoBody.detalle.forEach(det=>{
          //       const productoAux ={
          //         producto: det.producto,
          //         talle: det.talle,
          //         cantidad: det.cantidad
          //       }
          //       Stock
          //         .findOne({
          //           producto: det.producto,
          //           talle: Number(det.talle)
          //         })
          //         .select('-creada')
          //         .exec(
          //           (err,stock) => {
          //             if (!stock) {
          //               console.log("No se encontró stock a modificar")
          //             } else if (err) {
          //               console.log("Error al buscar el stock")
          //             } else {
          //               const nuevaCantidad = stock.cantidad - det.cantidad
          //               stock.cantidad = nuevaCantidad > 0 ? nuevaCantidad : 0
          //               stock.save((err, stock) => {
          //                 if (err) {
          //                   console.log("Error al restar stock")
          //                 } else {
          //                   console.log("Stock restado")
          //                 }
          //               })
          //             }
          //           }
          //         )
          //     })
          //   }
          // }
        }
        if(
          sum === pedidoBody.precioTotal &&
          pedidoBody.fechaEntregado
        ){
          estadoAux = "finalizado"
        }
        //Si no hay error, reemplazo con los datos del body
        const pedidos = []
        cliente.pedidos.forEach(ped=>{
          if(ped._id.toString() === req.params.idPedido.toString()){
            pedidos.push({
              fechaPedido: pedidoBody.fechaPedido,
              fechaEntrega: pedidoBody.fechaEntrega ? pedidoBody.fechaEntrega : null,
              fechaEntregado: pedidoBody.fechaEntregado ? pedidoBody.fechaEntregado : null,
              detalle: pedidoBody.detalle.map(det=>{
                return {
                  producto: det.producto,
                  talle: det.talle,
                  cantidad: det.cantidad
                }
              }),
              precioTotal: pedidoBody.precioTotal,
              pagos: pedidoBody.pagos.map(pago=>{
                return {
                  fecha: pago.fecha,
                  monto: pago.monto,
                  factura: pago.factura,
                  formaPago: pago.formaPago,
                  observaciones: pago.observaciones
                }
              }),
              estado: estadoAux,
              quitadoDeStock: pedidoBody.quitadoDeStock ? true : false
            })
          } else {
            pedidos.push(ped)
          }
        })
        cliente.pedidos = pedidos
        //Guardo los cambios en BD
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

//Eliminar pedido
module.exports.eliminarPedido = (req,res) => {
  if (!req.params.id || !req.params.idPedido) {
    res.status(404).json({ message: "Se requiere el id del cliente y del pedido"})
    return
  }
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
        const pedidos = []
        cliente.pedidos.forEach(pedido=>{
          if(pedido._id.toString() !== req.params.idPedido.toString()){
            pedidos.push(pedido)
          }
        })
        cliente.pedidos = pedidos
        //Guardo los cambios en BD
        cliente.save((err, clienteGuardado) => {
          if (err) {
            res.status(404).json(err)
          } else {
            res.status(201).json(clienteGuardado)
          }
        })
      }
    )
}