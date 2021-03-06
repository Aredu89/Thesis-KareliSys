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
      pedidoAPagar: null,
      //Permisos
      permits: "",
      permitsAdmin: false
    }
    this.cargarCliente = this.cargarCliente.bind(this)
    this.onOpenModal = this.onOpenModal.bind(this)
    this.onCloseModal = this.onCloseModal.bind(this)
    this.onSaveModal = this.onSaveModal.bind(this)
    this.handleEliminarPago = this.handleEliminarPago.bind(this)
    this.handleOnPagar = this.handleOnPagar.bind(this)
  }

  componentDidMount(){
    this.cargarCliente()
    //Controlo permisos
    const user = JSON.parse(localStorage.getItem("currentUser"))
    if(user){
      if(user.permits){
        this.setState({
          permits: user.permits.clientes ? user.permits.clientes : "",
          permitsAdmin: user.permitsAdmin
        })
      }
    }
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

  onClickGuardar(pedido){
    if(pedido._id){
      fetch(`/api/clientes/${this.props.params.id}/pedidos/${pedido._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
      })
        .then(res => {
          if(res.ok) {
            res.json()
              .then(data => {
                this.cargarCliente()
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
    } else {
      Swal.fire(
        "Error. No se recibió el id del pedido",
        "",
        "error"
      )
    }
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
      [cual+"Editar"]: {},
      pedidoAPagar: {}
    })
  }
  onSaveModal(pago){
    let cliente = this.state.cliente
    let pedidoModificar = {}
    cliente.pedidos.forEach(pedidoCliente=>{
      if(pedidoCliente._id.toString() === pago.pedidoId.toString()){
        let existe = false
        pedidoModificar = pedidoCliente
        let pagosAux = []
        pedidoCliente.pagos.forEach(pagoPedido=>{
          if(pagoPedido._id.toString() === pago._id.toString()){
            existe = true
            pagosAux.push({
              _id: pago._id,
              fecha: pago.fecha,
              monto: pago.monto,
              factura: pago.factura,
              formaPago: pago.formaPago,
              observaciones: pago.observaciones,
            })
          } else {
            pagosAux.push({
              _id: pagoPedido._id,
              fecha: pagoPedido.fecha,
              monto: pagoPedido.monto,
              factura: pagoPedido.factura,
              formaPago: pagoPedido.formaPago,
              observaciones: pagoPedido.observaciones,
            })
          }
        })
        if(!existe){
          pagosAux.push({
            _id: pago._id,
            fecha: pago.fecha,
            monto: pago.monto,
            factura: pago.factura,
            formaPago: pago.formaPago,
            observaciones: pago.observaciones,
          })
        }
        pedidoModificar.pagos = pagosAux
      }
    })
    this.onClickGuardar(pedidoModificar)
  }

  handleEliminarPago(id){
    let cliente = this.state.cliente
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
        const pagoAux = Funciones.getPagoFabrica(this.state.cliente, id)
        const pedidoAux = pagoAux.pedido
        let pagosAux = []
        pedidoAux.pagos.forEach(pagoPedido=>{
          if(pagoPedido._id.toString() !== id.toString()){
            pagosAux.push({
              _id: pagoPedido._id,
              fecha: pagoPedido.fecha,
              monto: pagoPedido.monto,
              factura: pagoPedido.factura,
              formaPago: pagoPedido.formaPago,
              observaciones: pagoPedido.observaciones,
            })
          }
        })
        pedidoAux.pagos = pagosAux
        //Guardo los cambios
        this.onClickGuardar(pedidoAux)
      }
    })
  }

  handleOnPagar(pedido){
    this.setState({
      pedidoAPagar: pedido
    }, ()=>{
      this.onOpenModal("modalPagos")
    })
  }

  render() {
    const {
      permits
    } = this.state
    //Permisos
    const permitUpdate = permits === "MODIFICAR" ? true : false
    //Tabla
    const deuda = this.state.cliente.pedidos ? Funciones.getDeudaFabrica(this.state.cliente) : 0
    const pedidosAdeudados = this.state.cliente.pedidos ? Funciones.getPedidosAdeudados(this.state.cliente) : []
    const pagosRealizados = this.state.cliente.pedidos ? Funciones.getPagosFabrica(this.state.cliente) : []
    const columnsPagos = [
      ["Fecha","fecha","Fecha"],
      ["Monto","monto","Money"],
      ["Forma de Pago","formaPago","String"],
      ["Factura N°", "factura", "String"]
    ]
    const columnsPedidos = [
      ["Fecha del pedido","fechaPedido","Fecha"],
      ["Fecha de entrega","fechaEntrega","Fecha"],
      ["Precio total", "precioTotal", "Money"],
      ["Adeudado", "data", "Pedido Adeudado"],
      ["Estado","estado","String"]
    ]
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
            {/* Pedidos Adeudados */}
            <div>
              <div className="card border-primary" id="card">
                <div className="card-header d-flex justify-content-between">
                  <h5>Pedidos pendientes de cobro:</h5>
                </div>
                <div className="card-body contenedor-tabla">
                  <TablaFlexible
                    lista={"pedidosAdeudados"}
                    columns={columnsPedidos}
                    data={pedidosAdeudados}
                    onPagarPedido={this.handleOnPagar}
                    blockRead={!permitUpdate}
                    blockDelete={!permitUpdate}
                  />
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
                        Pagos: {pagosRealizados.length}
                        <i className="material-icons ml-3">keyboard_arrow_down</i>
                      </h5>
                    </button>
                </div>
                <div id="collapseOne" 
                  className="collapse" 
                  aria-labelledby="headingOne" 
                  data-parent="#card">
                  <div className="card-body contenedor-tabla">
                    <TablaFlexible
                      lista={"pagos"}
                      columns={columnsPagos}
                      data={pagosRealizados}
                      handleEliminar={this.state.permitsAdmin ? this.handleEliminarPago : null}
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
                  pedidoAPagar={this.state.pedidoAPagar}
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