import React from 'react'
import TablaFlexible from './TablaFlexible.jsx'
import Swal from 'sweetalert2'

export default class FabricasLista extends React.Component {
  constructor() {
    super()
    this.state = {
      fabricas: [],
      cargando: true,
      error: ""
    }
    this.cargarLista = this.cargarLista.bind(this)
    this.handleEditar = this.handleEditar.bind(this)
    this.handleEliminar = this.handleEliminar.bind(this)
    this.actualizarLista = this.actualizarLista.bind(this)
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

  onClickAgregar() {
    this.props.history.push("/fabricas/editar/")
  }

  handleEditar(id){
    this.props.history.push(`/fabricas/editar/${id}`)
  }

  handleEliminar(id){
    //Primero pido confirmación
    Swal.fire({
      title: "¿Seguro que desea eliminar?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar"
    }).then((result)=>{
      if(result.value){
        //Elimino
        fetch(`/api/fabricas/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(res => {
            if(res.ok){
                Swal.fire(
                  "Fabrica Eliminada",
                  "",
                  "success"
                ).then(()=>{
                  this.actualizarLista(id)
                })
            } else {
                Swal.fire(
                  "Error al eliminar",
                  "",
                  "error"
                )
            }
          })
          .catch(err=> {
            Swal.fire(
              "Error del servidor",
              err.message,
              "error"
            )
          })
      }
    })
  }

  actualizarLista(id){
    let auxFabricas = this.state.fabricas
    // Quito la fabricas eliminada de la lista del state
    auxFabricas.forEach((fabrica,i)=>{
      if(id === fabrica._id){
        auxFabricas.splice(i,1)
        this.setState({
          fabricas: auxFabricas
        })
        return
      }
    })
  }

  render() {
    const columns = [
      ["Nombre","nombre","String"],
      ["Ciudad","ciudad","String"],
      ["Dirección","direccion","String"]
    ]
    return (
      <div className="fabricas-lista">
        <div className="row">
          <div className="col-12 d-flex justify-content-between">
            {/* Titulo */}
            <h3>Fabricas</h3>
            {/* Boton para crear nuevo */}
            <button type="button" 
              className="btn btn-success"
              onClick={() => this.onClickAgregar()}
              >+ Agregar Fabrica</button>
          </div>
        </div>
        <div className="row">
          <div className="col-12 contenedor-tabla text-center">
            {
              !this.state.cargando ?
                // Tabla
                <TablaFlexible
                  columns={columns}
                  data={this.state.fabricas}
                  handleEditar={this.handleEditar}
                  handleEliminar={this.handleEliminar}
                />
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
        </div>
      </div>
    )
  }
}