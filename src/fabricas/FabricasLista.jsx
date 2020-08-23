import React from 'react'
import TablaFlexible from '../common/TablaFlexible.jsx'
import funciones from '../common/javascriptFunctions.js'
import Swal from 'sweetalert2'

export default class FabricasLista extends React.Component {
  constructor() {
    super()
    this.state = {
      fabricas: [],
      cargando: true,
      error: "",
      //Permisos
      permits: ""
    }
    this.cargarLista = this.cargarLista.bind(this)
    this.handleEditar = this.handleEditar.bind(this)
    this.handleEliminar = this.handleEliminar.bind(this)
    this.actualizarLista = this.actualizarLista.bind(this)
    this.goToPagos = this.goToPagos.bind(this)
    this.goToPedidos = this.goToPedidos.bind(this)
  }

  componentDidMount(){
    this.cargarLista()
    //Controlo permisos
    const user = JSON.parse(localStorage.getItem("currentUser"))
    if(user){
      if(user.permits){
        this.setState({
          permits: user.permits.fabricas ? user.permits.fabricas : ""
        })
      }
    }
  }

  //Obtener lista de fábricas
  cargarLista() {
    fetch('/api/fabricas')
      .then(res => {
        if(res.ok) {
          res.json()
          .then(data => {
            //Calculo las deudas a cada Fabrica
            let auxData = data.map(dato=>{
              const deuda = funciones.getDeuda(dato)
              dato.deuda = deuda
              return dato
            })
            console.log("Lista Fabricas: ",auxData)
            this.setState({
              cargando: false,
              fabricas: auxData,
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

  goToPedidos(id){
    this.props.history.push(`/fabricas/pedidos/${id}`)
  }

  goToPagos(id){
    this.props.history.push(`/fabricas/pagos/${id}`)
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
    const {
      permits
    } = this.state
    //Permisos
    const permitUpdate = permits === "MODIFICAR" ? true : false
    const permitCreate = permits === "MODIFICAR" ||
      permits === "CREAR" ? true : false
    const permitRead = permits === "MODIFICAR" ||
      permits === "CREAR" ||
      permits === "LEER" ? true : false
    //Tabla
    const columns = [
      ["Nombre","nombre","String"],
      ["Ciudad","ciudad","String"],
      ["Dirección","direccion","String"],
      ["Pedidos pendientes","pedidos","Largo pendiente"],
      ["A pagar","","Fabrica Adeudado"]
    ]
    return (
      <div className="fabricas-lista">
        <div className="row">
          <div className="col-12 d-flex justify-content-between">
            {/* Titulo */}
            <h3>Fabricas</h3>
            {/* Boton para crear nuevo */}
            {
              permitCreate &&
              <button type="button" 
                className="btn btn-success"
                onClick={() => this.onClickAgregar()}
                >+ Agregar Fabrica</button>
            }
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
                  goToPedidos={this.goToPedidos}
                  goToPagos={this.goToPagos}
                  blockRead={!permitRead}
                  blockDelete={!permitUpdate}
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