import React from 'react'
import TablaFlexible from './TablaFlexible.jsx'

export default class FabricasLista extends React.Component {
  constructor() {
    super()
    this.state = {
      fabricas: [],
      cargando: true,
      error: ""
    }
    this.cargarLista = this.cargarLista.bind(this)
  }

  componentDidMount(){
    this.cargarLista()
  }

  //Obtener lista de fábricas
  cargarLista() {
    fetch('/api/fabricas')
      .then(res => {
        if(res.ok) {
          res.json()
          .then(data => {
            console.log("Get List: ", data)
            this.setState({
              cargando: false,
              fabricas: data,
              error: ""
            })
          })
        } else {
          res.json()
          .then(error => {
            console.log("Error al obtener la lista. ", error.message)
            this.setState({
              cargando: false,
              error: error.message
            })
          })
        }
      })
      .catch(error => {
        console.log("Error: ",error.message)
        this.setState({
          cargando: false,
          error: error.message
        })
      })
  }

  //Crear una nueva fábrica
  crearRegistro(nuevaFabrica) {
    fetch('/api/fabricas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaFabrica),
    })
      .then(res => {
        if(res.ok) {
          res.json()
            .then(data => {
              console.log("Fabrica creada: ",data)
            })
        } else {
          res.json()
          .then(err => {
            console.log("Error al crear fabrica: ",err.message)
          })
        }
      })
      .catch(err => {
        console.log("Error al crear: ",err.message)
      })
  }

  render() {
    return (
      <div className="fabricas-lista">
        <div className="row">
          <div className="col-12 d-flex justify-content-between">
            {/* Titulo */}
            <h3>Fabricas</h3>
            {/* Boton para crear nuevo */}
            <button type="button" className="btn btn-success">+ Agregar Fabrica</button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {/* Tabla */}
            <TablaFlexible
            />
          </div>
        </div>
      </div>
    )
  }
}