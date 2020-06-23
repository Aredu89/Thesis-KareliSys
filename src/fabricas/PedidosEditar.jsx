import React from 'react'
import DatePicker from '../common/DatePicker.jsx'
import FormSelect from '../common/FormSelect.jsx'

export default class PedidosEditar extends React.Component {
  constructor() {
    super()
    this.state={
      _id: "",
      fechaPedido: "",
      errorFechaPedido: false,
      fechaEntrega: "",
      fechaEntregado: "",
      detalle: [],
      errorDetalle: false,
      precioTotal: "",
      errorPrecio: false,
      estado: "pendiente",
      pagos: [],
      nombreProducto: "",
      errorNombreProducto: false,
      talleProducto: "",
      errorTalleProducto: false,
      cantidadProducto: "",
      errorCantidadProducto: false,
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.agregarProducto = this.agregarProducto.bind(this)
    this.eliminarProducto = this.eliminarProducto.bind(this)
  }

  componentDidMount(){
    if(this.props.data){
      this.setState({
        _id: this.props.data._id,
        fechaPedido: this.props.data.fechaPedido ? this.fechaANumeros(this.props.data.fechaPedido) : "",
        fechaEntrega: this.props.data.fechaEntrega ? this.fechaANumeros(this.props.data.fechaEntrega) : "",
        fechaEntregado: this.props.data.fechaEntregado ? this.fechaANumeros(this.props.data.fechaEntregado) : "",
        detalle: this.props.data.detalle,
        precioTotal: this.props.data.precioTotal,
        estado: this.props.data.estado,
        pagos: this.props.data.pagos,
      })
    }
  }

  handleOnChange(event){
    this.setState({
      [event.target.name]: event.target.value
    })
    //Limpio el talle seleccionado
    if(event.target.name === "nombreProducto"){
      this.setState({
        talleProducto: ""
      })
    }
    //Limpio el error del nombre del producto
    if(event.target.name === "nombreProducto" && this.state.errorNombreProducto == true){
      this.setState({
        errorNombreProducto: false
      })
    }
    //Limpio el error del talle del producto
    if(event.target.name === "talleProducto" && this.state.errorTalleProducto == true){
      this.setState({
        errorTalleProducto: false
      })
    }
    //Limpio el error de cantidad del producto
    if(event.target.name === "cantidadProducto" && this.state.errorCantidadProducto == true){
      this.setState({
        errorCantidadProducto: false
      })
    }
    //Limpio el error de fecha del pedido
    if(event.target.name === "fechaPedido" && this.state.errorFechaPedido == true){
      this.setState({
        errorFechaPedido: false
      })
    }
  }

  agregarProducto(){
    let productos = this.state.detalle
    //controlar que el nombre tenga un valor
    if(
      this.state.nombreProducto &&
      this.state.talleProducto &&
      this.state.cantidadProducto
      ){
      productos.push({
        nombre: this.state.nombreProducto,
        talle: this.state.talleProducto,
        cantidad: this.state.cantidadProducto
      })
      this.setState({
        detalle: productos,
        errorDetalle: false
      })
    } else {
      let errorNombre = false
      let errorTalle = false
      let errorCantidad = false
      if(!this.state.nombreProducto){
        errorNombre = true
      }
      if(!this.state.talleProducto){
        errorTalle = true
      }
      if(!this.state.cantidadProducto){
        errorCantidad = true
      }
      this.setState({
        errorNombreProducto: errorNombre,
        errorTalleProducto: errorTalle,
        errorCantidadProducto: errorCantidad
      })
    }
  }

  eliminarProducto(i){
    let detalle = this.state.detalle
    detalle.splice(i,1)
    this.setState({
      detalle
    })
  }

  onSave(){
    if(this.state.fechaPedido && this.state.detalle.length > 0){
      this.props.onSave({
        _id: this.state._id,
        fechaPedido: this.state.fechaPedido ? this.numerosAFecha(this.state.fechaPedido) : new Date(),
        detalle: this.state.detalle,
        estado: this.state.estado
      }, "pedidos")
      this.props.onClose()
    } else {
      if(this.state.detalle.length < 1){
        this.setState({
          errorDetalle: true
        })
      }
      if(!this.state.fechaPedido){
        this.setState({
          errorFechaPedido: true
        })
      }
    }
  }

  primeraUpperCase(string){
    let firstLetter = string.slice(0,1)
    return firstLetter[0].toUpperCase() + string.substring(1)
  }

  fechaANumeros(fecha){
    const date = new Date(fecha)
    const dia = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const mesraw = date.getMonth() + 1
    const mes = mesraw < 10 ? '0' + mesraw : mesraw
    return dia + '/' + mes + '/' + date.getFullYear()
  }

  numerosAFecha(string){
    // Recibe un string con formato "dd/mm/yyyy"
    if(string){
      const numeros = string.split('/')
      const date = numeros[2] + '-' + numeros[1] + '-' + numeros[0]
      console.log("fecha a guardar: ", new Date(date))
      return new Date(date)
    } else {
      return new Date()
    }
  }

  render(){
    let productosOptions = []
    if(this.props.productos){
      this.props.productos.forEach(prod=>{
        productosOptions.push({
          id: prod.nombre,
          value: prod.nombre
        })
      })
    }
    let tallesOptions = []
    if(this.state.nombreProducto && this.props.productos){
      const producto = this.props.productos.find(prod=>prod.nombre === this.state.nombreProducto)
      if(producto){
        producto.talles.forEach(talle=>{
          tallesOptions.push({
            id: talle,
            value: talle
          })
        })
      }
    }
    return(
      <div className="contactos-editar">
        {/* Header */}
        <div className="header d-flex justify-content-between align-items-center">
          <span>{this.props.titulo}</span>
          <button
            type="button"
            className="modal-cerrar d-flex align-items-center"
            onClick={()=>this.props.onClose()}
            >
              <i className="material-icons">clear</i>
            </button>
        </div>
        {/* Formulario */}
        <div className="formulario pt-2">
          {/* Estado */}
          {
            this.state.estado &&
            <div className="col-12 form-group text-center pt-2">
              <label>Estado:</label>
              <div>{this.primeraUpperCase(this.state.estado)}</div>
            </div>
          }
          {/* Fecha del pedido */}
          <div className="col-12 form-group text-center pt-2">
            {/* <label className="mb-0">{`Fecha: ${funciones.formatearDate(this.state.fecha)}`}</label> */}
            <label>Fecha del pedido</label>
            <DatePicker
              name="fechaPedido"
              value={this.state.fechaPedido ? this.state.fechaPedido : ""}
              onChange={this.handleOnChange}
              error={this.state.errorFechaPedido}
              />
          </div>
          {/* Precio Total */}
          {
            this.state._id &&
            <div className="col-12 form-group text-center pt-2">
              <label>Precio Total</label>
              <input type="number" 
                className={this.state.errorPrecio ? "form-control is-invalid" : "form-control"}
                id="precioTotal" 
                name="precioTotal"
                placeholder="Precio Total..."
                value={this.state.precioTotal}
                onChange={this.handleOnChange} 
                />
              {
                this.state.errorPrecio &&
                <div className="invalid-feedback">Se debe ingresar un precio</div>
              }
            </div>
          }
          {/* Productos */}
          <div className="col-12 form-group text-center pt-2">
            <label>Agregar productos al pedido</label>
            <div className="contenedor-productos">
              <FormSelect
                label="Nombre"
                name="nombreProducto"
                value={this.state.nombreProducto}
                onChange={this.handleOnChange}
                error={this.state.errorNombreProducto}
                options={productosOptions}
                />
              <div className="d-flex justify-content-between">
                <div className="text-center">
                <FormSelect
                  label="Talle"
                  name="talleProducto"
                  value={this.state.talleProducto}
                  onChange={this.handleOnChange}
                  error={this.state.errorTalleProducto}
                  options={tallesOptions}
                  />
                </div>
                <div className="text-center">
                  <label>Cantidad</label>
                  <input type="number" 
                    className={this.state.errorCantidadProducto ? "form-control is-invalid" : "form-control"}
                    id="cantidadProducto" 
                    name="cantidadProducto"
                    placeholder="Cantidad..."
                    value={this.state.cantidadProducto}
                    onChange={this.handleOnChange} 
                    />
                  {
                    this.state.errorCantidadProducto &&
                    <div className="invalid-feedback">Ingrese una cantidad</div>
                  }
                </div>
                <div className="text-center d-flex align-items-end">
                  <button 
                    type="button"
                    className="btn btn-outline-success"
                    onClick={()=>this.agregarProducto()}
                    >+</button>
                </div>
              </div>
            </div>
            {/* Productos agregados */}
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Talle</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Quitar</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.detalle.map((producto, i)=>{
                    return <tr className="table-default" key={i}>
                      <td>{producto.nombre}</td>
                      <td>{producto.talle}</td>
                      <td>{producto.cantidad}</td>
                      <td>
                        <button 
                          type="button"
                          className="btn btn-outline-success"
                          onClick={()=>this.eliminarProducto(i)}
                          >X</button>
                      </td>
                    </tr>
                  })
                }
              </tbody>
            </table>
          </div>
          {/* Errores */}
          {this.state.errorDetalle &&
            <div className="col-12 form-group text-center pt-2">
              <div className="alert alert-dismissible alert-danger">
                {/* <button type="button" className="close" data-dismiss="alert">&times;</button> */}
                <strong>Error!</strong> El pedido debe tener productos
              </div>
            </div>
          }
          {/* Boton de guardar */}
          <div className="col-12 form-group text-center pt-2 boton-guardar">
            <button 
              type="button"
              className="btn btn-success"
              onClick={()=>this.onSave()}
              >Guardar</button>
          </div>
        </div>
      </div>
    )
  }
}