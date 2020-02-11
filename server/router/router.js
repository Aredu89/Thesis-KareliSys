const express = require('express')
const router = express.Router()

const fabricas = require('../controllers/fabricas.js')
const clientes = require('../controllers/clientes.js')
const stock = require('../controllers/stock.js')

//fabricas
router.get('/fabricas', fabricas.listaFabricas)
router.get('/fabricas/:id', fabricas.getFabrica)
router.put('/fabricas/:id', fabricas.modificarFabrica)
router.post('/fabricas', fabricas.crearFabrica)
router.delete('/fabricas/:id', fabricas.eliminarFabrica)

//clientes
router.get('/clientes', clientes.listaClientes)
router.get('/clientes/:id', clientes.getCliente)
router.put('/clientes/:id', clientes.modificarCliente)
router.post('/clientes', clientes.crearCliente)
router.delete('/clientes/:id', clientes.eliminarCliente)

//stock
router.get('/stock', stock.listaStock)
router.get('/stock/:id', stock.getStock)
router.put('/stock/:id', stock.modificarStock)
router.post('/stock', stock.crearStock)
router.delete('/stock/:id', stock.eliminarStock)

module.exports = router