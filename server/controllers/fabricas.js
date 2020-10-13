const mongoose = require('mongoose')
const Fabricas = mongoose.model('Fabricas')
// const Stock = mongoose.model('Stock')

//Obtengo el listado de fabricas
module.exports.listaFabricas = (req, res) => {
  // Para filtrar por algun parametro
  const filter = {}
  // if (req.query.status) filter.status = req.query.status
  Fabricas
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

//Obtengo los egresos del mes
module.exports.getEgresosMes = (req, res) => {
  // Para filtrar por algun parametro
  const filter = {}
  const { desde, hasta } = req.query
  Fabricas
    .find(filter)
    .exec((err, results, status) => {
      if(!results || results.length < 1){
        res.status(200).json({ egresosMes: 0 })
      } else if (err) {
        res.status(404).json(err)
      } else {
        //Obtengo el dia 1 del mes actual y del siguiente
        const ahora = req.query.fechaFiltro ? req.query.fechaFiltro : new Date()
        const año = ahora.getFullYear()
        const mes = ahora.getMonth()
        const mesSiguiente = mes === 11 ? 0 : mes + 1
        const desde1 = desde && hasta ? desde : new Date(año, mes, 1)
        const hasta1 = desde && hasta ? hasta : new Date(año, mesSiguiente, 1)
        let egresos = 0
        if(results.length > 0){
          results.forEach(fabrica=>{
            if(fabrica.pedidos.length > 0){
              fabrica.pedidos.forEach(pedido=>{
                if(pedido.pagos.length > 0){
                  pedido.pagos.forEach(pago=>{
                    if(pago.fecha > desde1 && pago.fecha < hasta1){
                      egresos = egresos + pago.monto
                    }
                  })
                }
              })
            }
          })
        }
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
  newFabrica.productos = auxBody.productos ? auxBody.productos.map(producto=>{
    return {
      nombre: producto.nombre,
      talles: producto.talles
    }
  }) : []
  newFabrica.contactos = auxBody.contactos ? auxBody.contactos.map(contacto=>{
    return {
      nombre: contacto.nombre,
      apellido: contacto.apellido,
      email: contacto.email,
      telefono: contacto.telefono
    }
  }) : []
  newFabrica.pedidos = []
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
        fabrica.productos = auxFabrica.productos ? auxFabrica.productos.map(producto=>{
          return {
            nombre: producto.nombre,
            talles: producto.talles
          }
        }) : []
        fabrica.contactos = auxFabrica.contactos ? auxFabrica.contactos.map(contacto=>{
          return {
            nombre: contacto.nombre,
            apellido: contacto.apellido,
            email: contacto.email,
            telefono: contacto.telefono
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
  //Controlo si hay pedidos asociados a la fábrica
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
        if(fabrica.pedidos.length > 0){
          res.status(404).json({ message: "No se puede eliminar una fábrica con pedidos"})
        } else {
          //Elimino la fábrica
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
      }
    })
}

//Crear pedido
module.exports.crearPedido = (req,res) => {
  if (!req.params.id) {
    res.status(404).json({ message: "Se requiere el id de la fábrica"})
    return
  }
  const pedidoBody = req.body
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
        fabrica.pedidos.push({
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

//Modificar pedido
module.exports.modificarPedido = (req,res) => {
  if (!req.params.id || !req.params.idPedido) {
    res.status(404).json({ message: "Se requiere el id de la fábrica y del pedido"})
    return
  }
  const pedidoBody = req.body
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
        //Defino el día de hoy
        const fechaHoy = new Date()
        //Defino si cambia el estado
        let estadoAux = "pendiente"
        if(
          pedidoBody.fechaEntrega &&
          pedidoBody.precioTotal
        ){
          estadoAux = "aprobado"
          //Agrego los productos del pedido a Stock
          // const pedidoAModificar = fabrica.pedidos.find(pedido=> pedido._id.toString() === pedidoBody._id.toString())
          // if(pedidoAModificar){
          //   if(!pedidoAModificar.enStock){
          //     pedidoBody.enStock = true
          //     pedidoBody.detalle.forEach(det=>{
          //       const productoAux ={
          //         producto: det.producto,
          //         estado: "pendiente",
          //         talle: det.talle,
          //         cantidad: det.cantidad
          //       }
          //       Stock
          //         .create(productoAux, (err, stock) => {
          //           if(err) {
          //             console.log("Error al agregar stock ", err)
          //           } else {
          //             console.log("Stock agregado ", stock)
          //           }
          //         })
          //     })
          //   }
          // }
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
        }
        if(
          sum === pedidoBody.precioTotal &&
          pedidoBody.fechaEntregado
        ){
          estadoAux = "finalizado"
        }
        //Si no hay error, reemplazo con los datos del body
        const pedidos = []
        fabrica.pedidos.forEach(ped=>{
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
              enStock: pedidoBody.enStock ? true : false
            })
          } else {
            pedidos.push(ped)
          }
        })
        fabrica.pedidos = pedidos
        //Guardo los cambios en BD
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

//Eliminar pedido
module.exports.eliminarPedido = (req,res) => {
  if (!req.params.id || !req.params.idPedido) {
    res.status(404).json({ message: "Se requiere el id de la fábrica y del pedido"})
    return
  }
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
        const pedidos = []
        fabrica.pedidos.forEach(pedido=>{
          if(pedido._id.toString() !== req.params.idPedido.toString()){
            pedidos.push(pedido)
          }
        })
        fabrica.pedidos = pedidos
        //Guardo los cambios en BD
        fabrica.save((err, fabricaGuardad) => {
          if (err) {
            res.status(404).json(err)
          } else {
            res.status(201).json(fabricaGuardad)
          }
        })
      }
    )
}