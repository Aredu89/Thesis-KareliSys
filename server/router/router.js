const express = require('express')
const router = express.Router()

const fabricas = require('../controllers/fabricas.js')

//fabricas
router.get('/fabricas', fabricas.listaFabricas)
router.get('/fabricas/:id', fabricas.getFabrica)
router.post('/fabricas', fabricas.crearFabrica)

module.exports = router