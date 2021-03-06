const express = require('express')
const router = express.Router()

const fabricas = require('../controllers/fabricas.js')
const clientes = require('../controllers/clientes.js')
const stock = require('../controllers/stock.js')
const usuarios = require('../controllers/users.js')

//fabricas
router.get('/fabricas', fabricas.listaFabricas)
router.get('/fabricas/:id', fabricas.getFabrica)
router.get('/egresos', fabricas.getEgresosMes)
router.put('/fabricas/:id', fabricas.modificarFabrica)
router.post('/fabricas', fabricas.crearFabrica)
router.delete('/fabricas/:id', fabricas.eliminarFabrica)
router.post('/fabricas/:id/pedidos', fabricas.crearPedido)
router.put('/fabricas/:id/pedidos/:idPedido', fabricas.modificarPedido)
router.delete('/fabricas/:id/pedidos/:idPedido', fabricas.eliminarPedido)

//clientes
router.get('/clientes', clientes.listaClientes)
router.get('/clientes/:id', clientes.getCliente)
router.get('/ingresos', clientes.getIngresosMes)
router.put('/clientes/:id', clientes.modificarCliente)
router.post('/clientes', clientes.crearCliente)
router.delete('/clientes/:id', clientes.eliminarCliente)
router.post('/clientes/:id/pedidos', clientes.crearPedido)
router.put('/clientes/:id/pedidos/:idPedido', clientes.modificarPedido)
router.delete('/clientes/:id/pedidos/:idPedido', clientes.eliminarPedido)

//stock
router.get('/stock', stock.listaStock)
router.get('/stock/:id', stock.getStock)
router.get('/stock-cantidad', stock.getCantidadStock)
router.put('/stock/:id', stock.modificarStock)
router.post('/stock', stock.crearStock)
router.delete('/stock/:id', stock.eliminarStock)

//usuarios
router.get('/usuarios', usuarios.listaUsuarios)
router.get('/usuarios/:id', usuarios.getUsuario)
router.put('/usuarios/:id', usuarios.modificarUsuario)
router.post('/registrar-usuario', usuarios.registrarUsuarios)
router.post('/loguear-usuario', usuarios.loguearUsuarios)
router.delete('/usuarios/:id', usuarios.eliminarUsuario)

module.exports = router