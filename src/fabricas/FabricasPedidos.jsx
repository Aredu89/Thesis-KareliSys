import React from 'react'
import TablaFlexible from '../common/TablaFlexible.jsx'
import Swal from 'sweetalert2' //https://github.com/sweetalert2/sweetalert2
import Funciones from '../common/javascriptFunctions.js'
import Modal from 'react-responsive-modal'
import PedidosEditar from './PedidosEditar.jsx'

export default class FabricasPedidos extends React.Component {
  constructor(){
    super()
    this.state = {
      fabrica: {},
      cargando: true,
      error: "",
      pedidos: [],
      modalPedidos: false,
      modalPedidosEditar: null,
      //Permisos
      permits: "",
      permitsAdmin: false
    }
    this.cargarFabrica = this.cargarFabrica.bind(this)
    this.handleEditarPedido = this.handleEditarPedido.bind(this)
    this.handleEliminarPedido = this.handleEliminarPedido.bind(this)
    this.onCrearPedido = this.onCrearPedido.bind(this)
  }

  componentDidMount(){
    this.cargarFabrica()
    //Controlo permisos
    const user = JSON.parse(localStorage.getItem("currentUser"))
    if(user){
      if(user.permits){
        this.setState({
          permits: user.permits.fabricas ? user.permits.fabricas : "",
          permitsAdmin: user.permitsAdmin
        })
      }
    }
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
                fabrica: data,
                pedidos: data.pedidos,
                productos: data.productos,
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
          console.log("Error en el servidor. ",error.message)
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

  handleEditarPedido(id){
    //Busco el id
    this.state.pedidos.forEach(pedido => {
      if(pedido._id === id){
        this.setState({
          modalPedidosEditar: pedido
        }, this.onOpenModal("modalPedidos"))
        return
      }
    })
  }

  handleEliminarPedido(id){
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
        fetch(`/api/fabricas/${this.state.fabrica._id}/pedidos/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(res => {
            if(res.ok){
              res.json()
                .then(data=>{
                  Swal.fire(
                    "Pedido Eliminado",
                    "",
                    "success"
                  ).then(()=>{
                    this.setState({
                      pedidos: data.pedidos
                    })
                  })
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

  //Modal
  onOpenModal(cual){
    this.setState({
      [cual]: true
    })
  }
  onCloseModal(cual){
    this.setState({
      [cual]: false,
      [cual+"Editar"]: null
    })
  }

  onCrearPedido(obj){
    if(obj._id){
      //Modifico un pedido existente
      fetch(`/api/fabricas/${this.state.fabrica._id}/pedidos/${obj._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
      })
        .then(res => {
          if(res.ok) {
            res.json()
              .then(data => {
                Swal.fire(
                  "Pedido modificado!",
                  "",
                  "success"
                ).then(()=>{
                  this.setState({
                    pedidos: data.pedidos
                  })
                })
              })
          } else {
            res.json()
            .then(err => {
              console.log("Error al modificar pedido: ",err.message)
              Swal.fire(
                "Error al modificar el pedido",
                err.message,
                "error"
              )
            })
          }
        })
        .catch(err => {
          console.log("Error al crear: ",err.message)
          Swal.fire(
            "Error del servidor",
            err.message,
            "error"
          )
        })
    } else {
      //Crear pedido
      fetch(`/api/fabricas/${this.state.fabrica._id}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
      })
        .then(res => {
          if(res.ok) {
            res.json()
              .then(data => {
                Swal.fire(
                  "Pedido creado!",
                  "",
                  "success"
                ).then(()=>{
                  this.setState({
                    pedidos: data.pedidos
                  })
                })
              })
          } else {
            res.json()
            .then(err => {
              console.log("Error al crear pedido: ",err.message)
              Swal.fire(
                "Error al crear el pedido",
                "",
                "error"
              )
            })
          }
        })
        .catch(err => {
          console.log("Error al crear: ",err.message)
          Swal.fire(
            "Error del servidor",
            "",
            "error"
          )
        })
    }
  }

  render(){
    const {
      permits
    } = this.state
    //Permisos
    const permitUpdate = permits === "MODIFICAR" ? true : false
    const permitCreate = permits === "MODIFICAR" ||
      permits === "CREAR" ? true : false
    //Tabla
    const columnsPedidos = [
      ["Fecha del pedido","fechaPedido","Fecha"],
      ["Fecha de entrega","fechaEntrega","Fecha"],
      ["Precio total", "precioTotal", "Money"],
      ["Adeudado", "data", "Pedido Adeudado"],
      ["Productos","detalle","Largo"],
      ["Estado","estado","String"]
    ]
    return(
      <div className="fabricas-pedidos text-center">
        {!this.state.cargando ?
          <div>
            <div className="row mb-3">
              <div className="col-12 d-flex justify-content-between">
                <h3>Gestión de Pedidos - {this.state.fabrica.nombre}</h3>
              </div>
            </div>
            {/* Pedidos */}
            <div>
              <div className="card border-primary" id="card">
                <div className="card-header d-flex justify-content-between">
                  <h5>Pedidos de la fábrica:</h5>
                  {
                    permitUpdate &&
                      <button type="button" 
                        className="btn btn-outline-success"
                        onClick={() => this.onOpenModal("modalPedidos")}
                        >+ Agregar Pedido</button>
                  }
                </div>
                <div className="card-body contenedor-tabla">
                  <TablaFlexible
                    lista={"pedidos"}
                    columns={columnsPedidos}
                    data={this.state.pedidos}
                    handleEditar={this.handleEditarPedido}
                    handleEliminar={this.handleEliminarPedido}
                    blockRead={this.state.nuevo && permitCreate ||
                      !this.state.nuevo && permitUpdate ? false : true}
                    blockDelete={this.state.nuevo && permitCreate ||
                      !this.state.nuevo && permitUpdate ? false : true}
                  />
                </div>
              </div>
            </div>
            {/* Modal Pedidos */}
            <Modal
              classNames={{modal: ['modal-custom'], closeButton: ['modal-custom-button']}}
              onClose={()=>this.onCloseModal("modalPedidos")}
              showCloseIcon={false}
              open={this.state.modalPedidos}
              center
              >
                <PedidosEditar
                  data={this.state.modalPedidosEditar}
                  productos={this.state.productos}
                  onSave={this.onCrearPedido}
                  onClose={()=>this.onCloseModal("modalPedidos")}
                  titulo={this.state.modalPedidosEditar ? "EDITAR PEDIDO" : "CREAR PEDIDO"}
                />
            </Modal>
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