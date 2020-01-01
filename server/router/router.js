const express = require('express')
const router = express.Router()

const fabricas = require('../controllers/fabricas.js')
const stock = require('../controllers/stock.js')

//fabricas
router.get('/fabricas', fabricas.listaFabricas)
router.get('/fabricas/:id', fabricas.getFabrica)
router.put('/fabricas/:id', fabricas.modificarFabrica)
router.post('/fabricas', fabricas.crearFabrica)
router.delete('/fabricas/:id', fabricas.eliminarFabrica)

//stock
router.get('/stock', stock.listaStock)
router.get('/stock/:id', stock.getStock)
router.put('/stock/:id', stock.modificarStock)
router.post('/stock', stock.crearStock)
router.delete('/stock/:id', stock.eliminarStock)

module.exports = router