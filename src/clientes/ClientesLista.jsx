import React from 'react'
import TablaFlexible from '../common/TablaFlexible.jsx'
import funciones from '../common/javascriptFunctions.js'
import Swal from 'sweetalert2'

export default class ClientesLista extends React.Component {
  constructor() {
    super()
    this.state = {
      clientes: [],
      cargando: true,
      error: ""
    }
    this.cargarLista = this.cargarLista.bind(this)
    this.handleEditar = this.handleEditar.bind(this)
    this.handleEliminar = this.handleEliminar.bind(this)
    this.actualizarLista = this.actualizarLista.bind(this)
    this.goToPagos = this.goToPagos.bind(this)
  }

  componentDidMount(){
    this.cargarLista()
  }

  //Obtener lista de fábricas
  cargarLista() {
    fetch('/api/clientes')
      .then(res => {
        if(res.ok) {
          res.json()
          .then(data => {
            //Calculo las deudas a cada Cliente
            let auxData = data.map(dato=>{
              const deuda = funciones.getDeuda(dato)
              dato.deuda = deuda
              return dato
            })
            console.log("Lista Clientes: ",auxData)
            this.setState({
              cargando: false,
              clientes: auxData,
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
    this.props.history.push("/clientes/editar/")
  }

  handleEditar(id){
    this.props.history.push(`/clientes/editar/${id}`)
  }

  goToPagos(id){
    this.props.history.push(`/clientes/pagos/${id}`)
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
        fetch(`/api/clientes/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(res => {
            if(res.ok){
                Swal.fire(
                  "Cliente Eliminado",
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
    let auxClientes = this.state.clientes
    // Quito el cliente eliminado de la lista del state
    auxClientes.forEach((cliente,i)=>{
      if(id === cliente._id){
        auxClientes.splice(i,1)
        this.setState({
          clientes: auxClientes
        })
        return
      }
    })
  }

  render() {
    const columns = [
      ["Nombre","nombre","String"],
      ["Ciudad","ciudad","String"],
      ["Dirección","direccion","String"],
      ["Pedidos pendientes","pedidos","Largo pendiente"],
      ["A cobrar","","Deuda"]
    ]
    return (
      <div className="fabricas-lista">
        <div className="row">
          <div className="col-12 d-flex justify-content-between">
            {/* Titulo */}
            <h3>Clientes</h3>
            {/* Boton para crear nuevo */}
            <button type="button" 
              className="btn btn-success"
              onClick={() => this.onClickAgregar()}
              >+ Agregar Cliente</button>
          </div>
        </div>
        <div className="row">
          <div className="col-12 contenedor-tabla text-center">
            {
              !this.state.cargando ?
                // Tabla
                <TablaFlexible
                  columns={columns}
                  data={this.state.clientes}
                  handleEditar={this.handleEditar}
                  handleEliminar={this.handleEliminar}
                  goToPagos={this.goToPagos}
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