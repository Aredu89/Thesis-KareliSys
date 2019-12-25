const express = require('express')
const router = express.Router()

const fabricas = require('../controllers/fabricas.js')

//fabricas
router.get('/fabricas', fabricas.listaFabricas)
router.get('/fabricas/:id', fabricas.getFabrica)
router.put('/fabricas/:id', fabricas.modificarFabrica)
router.post('/fabricas', fabricas.crearFabrica)
router.delete('/fabricas/:id', fabricas.eliminarFabrica)

module.exports = router