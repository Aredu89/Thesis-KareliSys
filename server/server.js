const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const MongoClient = require('mongodb').MongoClient
const Issue = require('./issue.js')

let db

app.use(express.static('static'))
app.use(bodyParser.json())

MongoClient.connect('mongodb://localhost/issuetracker')
  .then(connection => {
    db = connection
    app.listen(3000, function () {
      console.log('App started on port 3000')
    })
  })
  .catch(err => {
      console.log('ERROR:', err)
  })

// API REST
//Get List
app.get('/api/issues', (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  db.collection('issues').find(filter).toArray()
    .then(issues => {
      const metadata = { total_count: issues.length }
      res.json({ _metadata: metadata, data: issues })
    })
    .catch(error => {
      console.log("Error al obtener issues: ",error)
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })
})

//POST Create
app.post('/api/issues', (req, res) => {
  const newIssue = req.body
  newIssue.created = new Date()
  if (!newIssue.status)
    newIssue.status = 'New'
  //validaciones
  const err = Issue.validateIssue(newIssue)
  if (err) {
    res.status(422).json({ message: `Invalid requrest: ${err}` })
    return
  }
  //Inserto en la base de datos
  db.collection('issues').insertOne(newIssue)
  .then(result =>
    db.collection('issues').find({ _id: result.insertedId }).limit(1).next()
    )
    .then(newIssue => {
      res.json(newIssue)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: `Internal Server Error: ${error}` })
    })
})

//FIN de API REST

app.get('*', (req, res) => {
  res.sendFile(path.resolve('static/index.html'))
})