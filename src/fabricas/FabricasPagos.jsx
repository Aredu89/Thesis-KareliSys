import React from 'react'
import TablaFlexible from '../common/TablaFlexible.jsx'
import Swal from 'sweetalert2' //https://github.com/sweetalert2/sweetalert2
import Funciones from '../common/javascriptFunctions.js'

export default class FabricasPagos extends React.Component {
  constructor(){
    super()
    this.state = {
      fabrica: {},
      cargando: true,
      error: ""
    }
    this.cargarFabrica = this.cargarFabrica.bind(this)
  }

  componentDidMount(){
    this.cargarFabrica()
  }

  cargarFabrica(){
    if(this.props.params.id){
      // Obtengo los pagos de la fábrica
      fetch(`/api/fabricas/${this.props.params.id}`)
        .then(res =>{
          if(res.ok){
            res.json()
            .then(data =>{
              console.log("Fabrica: ",data)
              this.setState({
                cargando: false,
                error: "",
                fabrica: data
              })
            })
          } else {
            res.json()
            .then(error => {
              console.log("Error al obtener fabrica - ",error.message)
              this.setState({
                cargando: false,
                error: error.message
              })
            })
          }
        })
        .catch(error => {
          console.log("Error en el fetch. ",error.message)
          this.setState({
            cargando: false,
            error: error.message
          })
        })
    } else {
      this.setState({
        cargando: false,
        error: "No se puede cargar esta pantalla sin el id de la Fábrica"
      })
    }
  }

  onSave(){
    fetch(`/api/fabricas/${this.props.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state.fabrica),
    })
      .then(res => {
        if(res.ok) {
          res.json()
            .then(data => {
              Swal.fire(
                "Cambios Guardados!",
                "",
                "success"
              ).then(()=>{
                this.props.history.push("/fabricas")
              })
            })
        } else {
          res.json()
          .then(err => {
            console.log("Error al modificar fabrica: ",err.message)
            Swal.fire(
              "Error al modificar la fábrica",
              "",
              "error"
            )
          })
        }
      })
      .catch(err => {
        console.log("Error al modificar: ",err.message)
        Swal.fire(
          "Error del servidor",
          "",
          "error"
        )
      })
  }

  render() {
    const deuda = Funciones.getDeuda(this.state.fabrica)
    return (
      <div className="fabricas-pagos text-center">
        {!this.state.cargando ?
          <div>
            <div className="row">
              <div className="col-12 d-flex justify-content-between">
                <h3>Gestión de Pagos</h3>
                {/* Boton para guardar cambios */}
                <button type="button" 
                  className="btn btn-success"
                  onClick={() => this.onClickGuardar()}
                  >+ Guardar Cambios</button>
              </div>
            </div>
            {/* Deuda */}

          </div>
          :
            this.state.error ?
            //Mensaje de error
            <div className="alert alert-dismissible alert-danger">
              <button type="button" className="close" data-dismiss="alert">&times;</button>
              <strong>Error!</strong> {this.state.error}
            </div>
          :
            // Spinner
            <div className="spinner-border text-light" role="status">
              <span className="sr-only">Loading...</span>
            </div>
        }
      </div>
    )
  }
}