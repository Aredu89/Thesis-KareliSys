const express = require('express')
const router = express.Router()

const issues = require('../controllers/issues')

//issues
router.get('/issues', issues.issueList)
router.post('/issues', issues.issueCreate)

module.exports = router