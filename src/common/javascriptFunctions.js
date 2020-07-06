// Formatear una fecha
module.exports.formatearDate = date => {
  const fecha = new Date(date)
  const dd = fecha.getDate()
  const mm = fecha.getMonth()+1
  const yyyy = fecha.getFullYear()
  return dd+"/"+mm+"/"+yyyy
}

// Formatear dinero
module.exports.moneyFormatter = number => {
  const formatter = new Intl.NumberFormat()
  return `$${formatter.format(number)}`
}

//Devolver Si o No con Booleano
module.exports.booleanFormatter = bool => {
  const resultado = bool ? 'Si' : 'No'
  return resultado
}

// Obtener la deuda de una fábrica o un cliente
// Parámetro: objeto - fábrica o cliente
module.exports.getDeuda = data => {
  let deudaFinal = 0
  let deudas = 0
  let pagado = 0
  if(data.pedidos){
    data.pedidos.forEach(pedido => {
      deudas = deudas + pedido.precioTotal
    })
  }
  if(data.pagos){
    data.pagos.forEach(pago=>{
      pagado = pagado + pago.monto
    })
  }
  if((deudas - pagado) > 0){
    deudaFinal = deudas - pagado
  }
  return deudaFinal
}

// Obtener deuda de un pedido
// Función local
const getDeudaPedidoLocal = data => {
  let sumaPagos = 0
  const precio = data.precioTotal ? data.precioTotal : 0
  if(data.pagos){
    data.pagos.forEach(pago=>{
      sumaPagos = sumaPagos + pago.monto
    })
  }
  const deuda = (precio - sumaPagos) > 0 ? precio - sumaPagos : 0
  return deuda
}
// data: objeto --> pedido { precioTotal: xx, pagos: [{ monto: xxx }]}
module.exports.getDeudaPedido = data => {
  return getDeudaPedidoLocal(data)
}

//Obtener deuda de una fábrica
// data: objeto --> Fabrica { pedidos: [{ precioTotal: xx, pagos: [{ monto: xxx }]}] }
module.exports.getDeudaFabrica = data => {
  let deudaTotal = 0
  if(data.pedidos){
    data.pedidos.forEach(pedido=>{
      const deuda = getDeudaPedidoLocal(pedido)
      deudaTotal = deudaTotal + deuda
    })
  }
  return deudaTotal
}

//Obtener pedidos pendientes de pago de una fábrica
module.exports.getPedidosAdeudados = data => {
  let pedidosAdeudados = []
  if(data.pedidos){
    data.pedidos.forEach(pedido=>{
      const deuda = getDeudaPedidoLocal(pedido)
      if(deuda > 0){
        pedidosAdeudados.push(pedido)
      }
    })
  }
  return pedidosAdeudados
}

//Obtener pagos realizados a una fábrica
module.exports.getPagosFabrica = data => {
  let pagos = []
  if(data.pedidos){
    data.pedidos.forEach(pedido=>{
      if(pedido.pagos){
        pedido.pagos.forEach(pago=>{
          pago.pedido = pedido
          pagos.push(pago)
        })
      }
    })
  }
  return pagos
}