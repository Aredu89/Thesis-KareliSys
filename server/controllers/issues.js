const mongoose = require('mongoose')
// const Issues = mongoose.model('Issues')

//Obtengo el listado de issues
module.exports.issueList = (req, res) => {
  const filter = {}
  if (req.query.status) filter.status = req.query.status
  Issues
    .find(filter)
    .exec((err, results, status) => {
      if(!results){
        res.status(404).json({ message: "No se encontraron issues"})
      } else if (err) {
        res.status(404).json(err)
      } else {
        res.status(200).json(results)
      }
    })
}

//Creo una nueva issue
module.exports.issueCreate = (req, res) => {
  const newIssue = req.body
  newIssue.created = new Date()
  if (!newIssue.status) newIssue.status = 'New'
  Issues
    .create(newIssue, (err, issue) => {
      if(err) {
        res.status(400).json(err)
      } else {
        res.status(201).json(issue)
      }
    })
}