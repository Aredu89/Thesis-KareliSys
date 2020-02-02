module.exports.formatearDate = date => {
  const fecha = new Date(date)
  const dd = fecha.getDate()
  const mm = fecha.getMonth()+1
  const yyyy = fecha.getFullYear()
  return dd+"/"+mm+"/"+yyyy
}

module.exports.getDeuda = data => {
  let deudaFinal = 0
  let deudas = 0
  let pagado = 0
  data.pedidos.forEach(pedido => {
    deudas = deudas + pedido.precioTotal
  })
  data.pagos.forEach(pago=>{
    pagado = pagado + pago.monto
  })
  if((deudas - pagado) > 0){
    deudaFinal = deudas - pagado
  }
  return deudaFinal
}