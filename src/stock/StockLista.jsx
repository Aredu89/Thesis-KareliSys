import React from 'react'
import TablaFlexible from '../common/TablaFlexible.jsx'
import Swal from 'sweetalert2'

export default class StockLista extends React.Component {
  constructor() {
    super()
    this.state = {
      stock: [],
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

  //Obtener lista de stock
  cargarLista() {
    fetch('/api/stock')
      .then(res => {
        if(res.ok) {
          res.json()
          .then(data => {
            console.log("Stock list: ", data)
            this.setState({
              cargando: false,
              stock: data,
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
    this.props.history.push("/stock/editar/")
  }

  handleEditar(id){
    this.props.history.push(`/stock/editar/${id}`)
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
        fetch(`/api/stock/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(res => {
            if(res.ok){
                Swal.fire(
                  "Stock Eliminado",
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
    let auxStock = this.state.stock
    // Quito el stock eliminado de la lista del state
    auxStock.forEach((stock,i)=>{
      if(id === stock._id){
        auxStock.splice(i,1)
        this.setState({
          stock: auxStock
        })
        return
      }
    })
  }

  render() {
    const columns = [
      ["Producto","producto","String"],
      ["Tipo","tipo","String"],
      ["Material","material","String"],
      ["Talle","talle","String"],
      ["Estilo","estilo","String"],
      ["Cantidad","cantidad","String"],
      ["Estante","estante","String"]
    ]
    return (
      <div className="fabricas-lista">
        <div className="row">
          <div className="col-12 d-flex justify-content-between">
            {/* Titulo */}
            <h3>Stock</h3>
            {/* Boton para crear nuevo */}
            <button type="button" 
              className="btn btn-success"
              onClick={() => this.onClickAgregar()}
              >+ Agregar Stock</button>
          </div>
        </div>
        <div className="row">
          <div className="col-12 contenedor-tabla text-center">
            {
              !this.state.cargando ?
                // Tabla
                <TablaFlexible
                  columns={columns}
                  data={this.state.stock}
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