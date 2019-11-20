const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
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
    console.log('ERROR:', error)
 })

// API REST
//Get List
app.get('/api/issues', (req, res) => {
  db.collection('issues').find().toArray()
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
  newIssue.id = issues.length + 1
  newIssue.created = new Date()
  if (!newIssue.status)
    newIssue.status = 'New'
  //validaciones
  const err = validateIssue(newIssue)
  if (err) {
    res.status(422).json({ message: `Invalid requrest: ${err}` })
    return
  }
  issues.push(newIssue)
  res.json(newIssue)
})

//Validaciones
const validIssueStatus = {
  New: true,
  Open: true,
  Assigned: true,
  Fixed: true,
  Verified: true,
  Closed: true,
};
const issueFieldType = {
  id: 'required',
  status: 'required',
  owner: 'required',
  effort: 'optional',
  created: 'required',
  completionDate: 'optional',
  title: 'required',
};
function validateIssue(issue) {
  for (const field in issueFieldType) {
    const type = issueFieldType[field]
    if (!type) {
      delete issue[field]
    } else if (type === 'required' && !issue[field]) {
      return `${field} is required.`
    }
  }
  if (!validIssueStatus[issue.status])
    return `${issue.status} is not a valid status.`
  return null
}
//FIN de API REST