import React from 'react'
import TablaFlexible from '../common/TablaFlexible.jsx'
import Swal from 'sweetalert2' //https://github.com/sweetalert2/sweetalert2
import Funciones from '../common/javascriptFunctions.js'
import Modal from 'react-responsive-modal'
import PagosEditar from'./PagosEditar.jsx'

export default class ClientesPagos extends React.Component {
  constructor(){
    super()
    this.state = {
      cliente: {},
      cargando: true,
      error: "",
      modalPagos: false,
      modalPagosEditar: null,
    }
    this.cargarCliente = this.cargarCliente.bind(this)
    this.onOpenModal = this.onOpenModal.bind(this)
    this.onCloseModal = this.onCloseModal.bind(this)
    this.onSaveModal = this.onSaveModal.bind(this)
    this.handleEditarPago = this.handleEditarPago.bind(this)
    this.handleEliminarPago = this.handleEliminarPago.bind(this)
  }

  componentDidMount(){
    this.cargarCliente()
  }

  cargarCliente(){
    if(this.props.params.id){
      // Obtengo los pagos de la fábrica
      fetch(`/api/clientes/${this.props.params.id}`)
        .then(res =>{
          if(res.ok){
            res.json()
            .then(data =>{
              console.log("Cliente: ",data)
              this.setState({
                cargando: false,
                error: "",
                cliente: data
              })
            })
          } else {
            res.json()
            .then(error => {
              console.log("Error al obtener cliente - ",error.message)
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

  onClickGuardar(cliente){
    fetch(`/api/clientes/${this.props.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente),
    })
      .then(res => {
        if(res.ok) {
          res.json()
            .then(data => {
              this.setState({
                cliente: data
              })
              Swal.fire(
                "Cambios Guardados!",
                "",
                "success"
              )
            })
        } else {
          res.json()
          .then(err => {
            console.log("Error al insertar o modificar pago: ",err.message)
            Swal.fire(
              "Error al insertar o modificar pago",
              "",
              "error"
            )
          })
        }
      })
      .catch(err => {
        console.log("Error del servidor: ",err.message)
        Swal.fire(
          "Error del servidor",
          "",
          "error"
        )
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
  onSaveModal(pago){
    let cliente = this.state.cliente
    let pagos = cliente.pagos
    if(pago._id){
      pagos.forEach((p, i) =>{
        if(p._id === pago._id){
          pagos.splice(i,1,pago)
        }
      })
    } else {
      pagos.push(pago)
    }
    cliente.pagos = pagos
    this.onClickGuardar(cliente)
  }

  handleEditarPago(id){
    let pago = {}
    this.state.cliente.pagos.forEach(p=>{
      if(id === p._id){
        pago = p
      }
    })
    this.setState({
      modalPagosEditar: pago,
      modalPagos: true
    })
  }

  handleEliminarPago(id){
    let cliente = this.state.cliente
    let pagos = cliente.pagos
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
        // Elimino el pago
        pagos.forEach((p,i)=>{
          if(id === p._id){
            pagos.splice(i,1)
          }
        })
        cliente.pagos = pagos
        this.onClickGuardar(cliente)
      }
    })
  }

  render() {
    const deuda = Funciones.getDeuda(this.state.cliente)
    const columnsPagos = [
      ["Fecha","fecha","Fecha"],
      ["Monto","monto","Money"],
      ["Forma de Pago","formaPago","String"]
    ]
    const columnsPedidos = [
      ["Fecha","fecha","Fecha"],
      ["Productos","detalle","Largo"],
      ["Precio","precioTotal","String"],
      ["Estado","estado","String"]
    ]
    const pagosLength = this.state.cliente.pagos ? this.state.cliente.pagos.length : 0
    const pedidosLength = this.state.cliente.pedidos ? this.state.cliente.pedidos.length : 0
    return (
      <div className="fabricas-pagos text-center">
        {!this.state.cargando ?
          <div>
            <div className="row">
              <div className="col-12 d-flex justify-content-between">
                <h3>Gestión de Cobros - {this.state.cliente.nombre}</h3>
              </div>
              {/* Deuda */}
              <div className="mensaje-deuda">
                <h4>La deuda a cobrar es de: {Funciones.moneyFormatter(deuda)}</h4>
              </div>
            </div>
            {/* Pagos */}
            <div className="mt-3">
              <div className="card border-primary" id="card">
                <div className="card-header d-flex justify-content-between" id="headingOne">
                  <button type="button"
                    className="btn btn-link collapsed col-sm-8 col-6"
                    data-toggle="collapse"
                    data-target="#collapseOne"
                    aria-expanded="false" 
                    aria-controls="collapseOne">
                      <h5 className="d-flex align-items-center mb-0">
                        Pagos: {pagosLength}
                        <i className="material-icons ml-3">keyboard_arrow_down</i>
                      </h5>
                    </button>
                  <button type="button" 
                    className="btn btn-outline-success"
                    onClick={() => this.onOpenModal("modalPagos")}
                    >+ Agregar Pago</button>
                </div>
                <div id="collapseOne" 
                  className="collapse" 
                  aria-labelledby="headingOne" 
                  data-parent="#card">
                  <div className="card-body contenedor-tabla">
                    <TablaFlexible
                      lista={"pagos"}
                      columns={columnsPagos}
                      data={this.state.cliente.pagos ? this.state.cliente.pagos : []}
                      handleEditar={this.handleEditarPago}
                      handleEliminar={this.handleEliminarPago}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Pedidos */}
            <div className="mt-3">
              <div className="card border-primary" id="card">
                <div className="card-header d-flex justify-content-between" id="headingOne">
                  <button type="button"
                    className="btn btn-link collapsed col-sm-8 col-6"
                    data-toggle="collapse"
                    data-target="#collapseTwo"
                    aria-expanded="false" 
                    aria-controls="collapseTwo">
                      <h5 className="d-flex align-items-center mb-0">
                        Pedidos: {pedidosLength}
                        <i className="material-icons ml-3">keyboard_arrow_down</i>
                      </h5>
                    </button>
                </div>
                <div id="collapseTwo" 
                  className="collapse" 
                  aria-labelledby="headingOne" 
                  data-parent="#card">
                  <div className="card-body contenedor-tabla">
                    <TablaFlexible
                      lista={"pedidos"}
                      columns={columnsPedidos}
                      data={this.state.cliente.pedidos ? this.state.cliente.pedidos : []}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Modal pagos */}
            <Modal
              classNames={{modal: ['modal-custom'], closeButton: ['modal-custom-button']}}
              onClose={()=>this.onCloseModal("modalPagos")}
              showCloseIcon={false}
              open={this.state.modalPagos}
              center
              >
                <PagosEditar
                  data={this.state.modalPagosEditar}
                  onSave={this.onSaveModal}
                  onClose={()=>this.onCloseModal("modalPagos")}
                  titulo={this.state.modalPedidosEditar ? "EDITAR PAGO" : "CARGAR PAGO"}
                  deudaTotal={deuda}
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