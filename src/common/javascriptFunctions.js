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