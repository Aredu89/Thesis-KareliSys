import React from'react'
import { Link } from 'react-router'
import 'whatwg-fetch'

const newIssue = {
  status: 'Assigned', owner: 'Ariel',
  created: new Date('2016-08-16'), effort: 14,
  completionDate: new Date('2016-08-30'),
  title: 'Third issue',
}

export default class IssueList extends React.Component {
  constructor() {
    super()
    this.state = {

    }
  }

  componentDidMount() {
    null
  }

  cargarLista() {
    fetch('/api/issues')
      .then(res => {
        if(res.ok) {
          res.json()
          .then(data => {
            console.log("Get List: ", data)
          })
        } else {
          res.json()
          .then(error => {
            console.log("Error en get list")
          })
        }
      })
      .catch(error => {
        console.log("Error: ",error)
      })
  }

  crearRegistro() {
    fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIssue),
    })
      .then(res => {
        if(res.ok) {
          res.json()
            .then(data => {
              console.log("Create issue: ",data)
            })
        } else {
          res.json()
          .then(err => {
            console.log("Error al cargar issue: ",err.message)
          })
        }
      })
      .catch(err => {
        console.log("Error al crear: ",err.message)
      })
  }

  render() {
    return (
      <div className="issue-list">
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => this.cargarLista()}>
            Listar
        </button>
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => this.crearRegistro()}>
            Crear
        </button>
        <Link to="/link/123?status=Open">Link</Link> 
      </div>
    )
  }
}