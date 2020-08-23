import React from 'react'
import TablaFlexible from '../common/TablaFlexible.jsx'
import Swal from 'sweetalert2' //https://github.com/sweetalert2/sweetalert2
import Funciones from '../common/javascriptFunctions.js'
import Modal from 'react-responsive-modal'

export default class ClientesPedidos extends React.Component {
  constructor(){
    super()
    this.state = {
      cliente: {},
      cargando: true,
      error: "",
      //Permisos
      permits: "",
      permitsAdmin: false
    }
    this.cargarCliente = this.cargarCliente.bind(this)
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
          console.log("Error en el servidor. ",error.message)
          this.setState({
            cargando: false,
            error: error.message
          })
        })
    } else {
      this.setState({
        cargando: false,
        error: "No se puede cargar esta pantalla sin el id del Cliente"
      })
    }
  }

  render(){
    const {
      permits
    } = this.state
    //Permisos
    const permitUpdate = permits === "MODIFICAR" ? true : false
    return(
      <div className="fabricas-pedidos text-center">
        {!this.state.cargando ?
          <div>
            <div className="row mb-3">
              <div className="col-12 d-flex justify-content-between">
                <h3>Gestión de Pedidos - {this.state.cliente.nombre}</h3>
              </div>
            </div>
            {/* Pedidos */}
            <div>
              <div className="card border-primary" id="card">
                <div className="card-header d-flex justify-content-between">
                  <h5>Pedidos del cliente:</h5>
                </div>
                <div className="card-body contenedor-tabla">
                  
                </div>
              </div>
            </div>
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