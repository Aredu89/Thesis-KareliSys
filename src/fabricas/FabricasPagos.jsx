import React from 'react'
import TablaFlexible from '../common/TablaFlexible.jsx'
import Swal from 'sweetalert2' //https://github.com/sweetalert2/sweetalert2
import Funciones from '../common/javascriptFunctions.js'
import Modal from 'react-responsive-modal'
import PagosEditar from'./PagosEditar.jsx'

export default class FabricasPagos extends React.Component {
  constructor(){
    super()
    this.state = {
      fabrica: {},
      cargando: true,
      error: "",
      modalPagos: false,
      modalPagosEditar: null,
      //Permisos
      permits: ""
    }
    this.cargarFabrica = this.cargarFabrica.bind(this)
    this.onOpenModal = this.onOpenModal.bind(this)
    this.onCloseModal = this.onCloseModal.bind(this)
    this.onSaveModal = this.onSaveModal.bind(this)
    this.handleEditarPago = this.handleEditarPago.bind(this)
    this.handleEliminarPago = this.handleEliminarPago.bind(this)
  }

  componentDidMount(){
    this.cargarFabrica()
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

  onClickGuardar(fabrica){
    fetch(`/api/fabricas/${this.props.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fabrica),
    })
      .then(res => {
        if(res.ok) {
          res.json()
            .then(data => {
              this.setState({
                fabrica: data
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
    let fabrica = this.state.fabrica
    let pagos = fabrica.pagos
    if(pago._id){
      pagos.forEach((p, i) =>{
        if(p._id === pago._id){
          pagos.splice(i,1,pago)
        }
      })
    } else {
      pagos.push(pago)
    }
    fabrica.pagos = pagos
    this.onClickGuardar(fabrica)
  }

  handleEditarPago(id){
    let pago = {}
    this.state.fabrica.pagos.forEach(p=>{
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
    let fabrica = this.state.fabrica
    let pagos = fabrica.pagos
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
        fabrica.pagos = pagos
        this.onClickGuardar(fabrica)
      }
    })
  }

  render() {
    const {
      permits
    } = this.state
    //Permisos
    const permitUpdate = permits === "MODIFICAR" ? true : false
    //Tabla
    const deuda = this.state.fabrica.pedidos ? Funciones.getDeudaFabrica(this.state.fabrica) : 0
    const columnsPagos = [
      ["Fecha","fecha","Fecha"],
      ["Monto","monto","Money"],
      ["Forma de Pago","formaPago","String"]
    ]
    const pagosLength = this.state.fabrica.pagos ? this.state.fabrica.pagos.length : 0
    const pedidosLength = this.state.fabrica.pedidos ? this.state.fabrica.pedidos.length : 0
    return (
      <div className="fabricas-pagos text-center">
        {!this.state.cargando ?
          <div>
            <div className="row">
              <div className="col-12 d-flex justify-content-between">
                <h3>Gestión de Pagos - {this.state.fabrica.nombre}</h3>
              </div>
              {/* Deuda */}
              <div className="mensaje-deuda">
                <h4>La deuda es de: {Funciones.moneyFormatter(deuda)}</h4>
              </div>
            </div>
            {/* Pedidos Adeudados */}
            <div>
              <div className="card border-primary" id="card">
                <div className="card-header d-flex justify-content-between">
                  <h5>Pedidos pendientes de pago:</h5>
                </div>
                <div className="card-body contenedor-tabla">
                  Tabla
                </div>
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
                  {/* {
                    permitUpdate &&
                    <button type="button" 
                      className="btn btn-outline-success"
                      onClick={() => this.onOpenModal("modalPagos")}
                      >+ Agregar Pago</button>
                  } */}
                </div>
                <div id="collapseOne" 
                  className="collapse" 
                  aria-labelledby="headingOne" 
                  data-parent="#card">
                  <div className="card-body contenedor-tabla">
                    <TablaFlexible
                      lista={"pagos"}
                      columns={columnsPagos}
                      data={this.state.fabrica.pagos ? this.state.fabrica.pagos : []}
                      handleEditar={this.handleEditarPago}
                      handleEliminar={this.handleEliminarPago}
                      blockRead={!permitUpdate}
                      blockDelete={!permitUpdate}
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