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

// Obtener un pago realizado a una fábrica
module.exports.getPagoFabrica = (data, idPago) => {
  let pagoAux = {}
  if(data.pedidos){
    data.pedidos.forEach(pedido=>{
      if(pedido.pagos){
        pedido.pagos.forEach(pago=>{
          if(pago._id.toString() === idPago.toString()){
            pago.pedido = pedido
            pagoAux = pago
          }
        })
      }
    })
  }
  return pagoAux
}

//Convertir de números a fecha (Recibe un string en formato dd/mm/yyyy)
module.exports.numerosAFecha = string => {
  if(string){
    const numeros = string.split('/')
    const date = numeros[2] + '-' + numeros[1] + '-' + numeros[0]
    return new Date(date)
  } else {
    return null
  }
}

//Convertir de fecha a numeros dd/mm/yyyy
module.exports.fechaANumeros = fecha => {
  const date = new Date(fecha)
  const dia = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const mesraw = date.getMonth() + 1
  const mes = mesraw < 10 ? '0' + mesraw : mesraw
  return dia + '/' + mes + '/' + date.getFullYear()
}