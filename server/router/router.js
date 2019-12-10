const express = require('express')
const router = express.Router()

const fabricas = require('../controllers/fabricas.js')

//issues
router.get('/fabricas', fabricas.listaFabricas)
router.post('/fabricas', fabricas.crearFabrica)

module.exports = router