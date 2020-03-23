import React from 'react'
import TablaFlexible from '../common/TablaFlexible.jsx'
import funciones from '../common/javascriptFunctions.js'
import Swal from 'sweetalert2'

export default class UsuariosLista extends React.Component {
  constructor() {
    super()
    this.state = {
      usuarios: [],
      cargando: true,
      error: ""
    }
    this.cargarUsuarios = this.cargarUsuarios.bind(this)
  }

  componentDidMount(){
    this.cargarUsuarios()
  }

  cargarUsuarios(){
    fetch('/api/usuarios')
      .then(res => {
        if(res.ok) {
          res.json()
          .then(data => {
            console.log("Lista Usuarios: ", data)
            this.setState({
              cargando: false,
              usuarios: data,
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
        this.setState({
          cargando: false,
          error: error.message
        })
      })
  }

  onClickAgregar(){

  }

  handleEditar(){

  }

  handleEliminar(){
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
        fetch(`/api/usuarios/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(res => {
            if(res.ok){
                Swal.fire(
                  "Usuario Eliminado",
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
    let auxUsuarios = this.state.usuarios
    // Quito la fabricas eliminada de la lista del state
    auxUsuarios.forEach((usuario,i)=>{
      if(id === usuario._id){
        auxUsuarios.splice(i,1)
        this.setState({
          usuarios: auxUsuarios
        })
        return
      }
    })
  }

  render() {
    const columns = [
      ["Nombre de Usuario","name","String"],
      ["Email","email","String"],
      ["Permisos","permits","Boolean"]
    ]
    return (
      <div className="usuarios-lista">
        <div className="row">
          <div className="col-12 d-flex justify-content-between">
            {/* Titulo */}
            <h3>Usuarios</h3>
            {/* Boton para crear nuevo */}
            <button type="button" 
              className="btn btn-success"
              onClick={() => this.onClickAgregar()}
              >+ Agregar Usuario</button>
          </div>
        </div>
        {/* Lista */}
        <div className="row">
          <div className="col-12 text-center pt-3">
          {
            !this.state.cargando ?
              // Tabla
              <TablaFlexible
                columns={columns}
                data={this.state.usuarios}
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