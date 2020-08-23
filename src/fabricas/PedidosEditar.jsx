import React from 'react'
import DatePicker from '../common/DatePicker.jsx'
import FormSelect from '../common/FormSelect.jsx'
import funciones from '../common/javascriptFunctions.js'

export default class PedidosEditar extends React.Component {
  constructor() {
    super()
    this.state={
      _id: "",
      fechaPedido: "",
      errorFechaPedido: '',
      fechaEntrega: "",
      errorFechaEntrega: '',
      fechaEntregado: "",
      errorFechaEntregado: '',
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
        fechaPedido: this.props.data.fechaPedido ? funciones.fechaANumeros(this.props.data.fechaPedido) : "",
        fechaEntrega: this.props.data.fechaEntrega ? funciones.fechaANumeros(this.props.data.fechaEntrega) : "",
        fechaEntregado: this.props.data.fechaEntregado ? funciones.fechaANumeros(this.props.data.fechaEntregado) : "",
        detalle: this.props.data.detalle,
        precioTotal: this.props.data.precioTotal,
        estado: this.props.data.estado,
        pagos: this.props.data.pagos ? this.props.data.pagos : [],
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
    if(event.target.name === "fechaPedido" && this.state.errorFechaPedido !== ''){
      this.setState({
        errorFechaPedido: ''
      })
    }
    //Limpio el error de fecha de entrega
    if(event.target.name === "fechaEntrega" && this.state.errorFechaEntrega !== ''){
      this.setState({
        errorFechaEntrega: ''
      })
    }
    //Limpio el error de fecha de entregado
    if(event.target.name === "fechaEntregado" && this.state.errorFechaEntregado !== ''){
      this.setState({
        errorFechaEntregado: ''
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
        producto: this.state.nombreProducto,
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
      if(funciones.numerosAFecha(this.state.fechaEntrega) < funciones.numerosAFecha(this.state.fechaPedido)){
        this.setState({
          errorFechaEntrega: 'La fecha de entrega no puede ser menor a la fecha del pedido'
        })
      }
      if(funciones.numerosAFecha(this.state.fechaEntregado) < funciones.numerosAFecha(this.state.fechaPedido)){
        this.setState({
          errorFechaEntregado: 'La fecha de entregado no puede ser menor a la fecha del pedido'
        })
      }
      if(
        (funciones.numerosAFecha(this.state.fechaEntrega) >= funciones.numerosAFecha(this.state.fechaPedido) ||
        !this.state.fechaEntrega) &&
        (funciones.numerosAFecha(this.state.fechaEntregado) >= funciones.numerosAFecha(this.state.fechaPedido) ||
        !this.state.fechaEntregado)
      ){
        //Guardo el pedido
        this.props.onSave({
          _id: this.state._id,
          fechaPedido: this.state.fechaPedido ? funciones.numerosAFecha(this.state.fechaPedido) : new Date(),
          fechaEntrega: this.state.fechaEntrega ? funciones.numerosAFecha(this.state.fechaEntrega) : null,
          fechaEntregado: this.state.fechaEntregado ? funciones.numerosAFecha(this.state.fechaEntregado) : null,
          detalle: this.state.detalle,
          pagos: this.state.pagos ? this.state.pagos : [],
          precioTotal: this.state.precioTotal ? Number(this.state.precioTotal) : null,
          estado: this.state.estado
        })
        this.props.onClose()
      }
    } else {
      if(this.state.detalle.length < 1){
        this.setState({
          errorDetalle: true
        })
      }
      if(!this.state.fechaPedido){
        this.setState({
          errorFechaPedido: 'Ingrese una fecha'
        })
      }
    }
  }

  primeraUpperCase(string){
    let firstLetter = string.slice(0,1)
    return firstLetter[0].toUpperCase() + string.substring(1)
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
    const deudaPedido = this.props.data ? funciones.getDeudaPedido(this.props.data) : 0
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
            <label>Fecha del pedido</label>
            <DatePicker
              name="fechaPedido"
              value={this.state.fechaPedido ? this.state.fechaPedido : ""}
              onChange={this.handleOnChange}
              error={this.state.errorFechaPedido}
              disabled={this.state._id ? true : false}
              />
          </div>
          {/* Fecha de entrega */}
          {
            this.state._id &&
            <div className="col-12 form-group text-center pt-2">
              <label>Fecha de entrega</label>
              <DatePicker
                name="fechaEntrega"
                value={this.state.fechaEntrega ? this.state.fechaEntrega : ""}
                onChange={this.handleOnChange}
                error={this.state.errorFechaEntrega}
                disabled={this.state.estado !== 'pendiente' ? true : false}
                />
            </div>
          }
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
                disabled={this.state.estado !== 'pendiente' ? true : false}
                />
              {
                (deudaPedido > 0) &&
                <div className="alerta-feedback">{`Adeudado: ${funciones.moneyFormatter(deudaPedido)}`}</div>
              }
            </div>
          }
          {/* Fecha Entregado */}
          {
            this.state._id &&
            this.state.estado !== 'pendiente' &&
            <div className="col-12 form-group text-center pt-2">
              <label>Fecha Entregado</label>
              <DatePicker
                name="fechaEntregado"
                value={this.state.fechaEntregado ? this.state.fechaEntregado : ""}
                error={this.state.errorFechaEntregado}
                onChange={this.handleOnChange}
                />
            </div>
          }
          {/* Productos */}
          <div className="col-12 form-group text-center pt-2">
            <label>{this.state.estado === 'pendiente' ? "Agregar productos al pedido" : "Productos del pedido"}</label>
            {this.state.estado === 'pendiente' && <div className="contenedor-productos">
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
            </div>}
            {/* Productos agregados */}
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Talle</th>
                  <th scope="col">Cantidad</th>
                  {this.state.estado === 'pendiente' && <th scope="col">Quitar</th>}
                </tr>
              </thead>
              <tbody>
                {
                  this.state.detalle.map((producto, i)=>{
                    return <tr className="table-default" key={i}>
                      <td>{producto.producto}</td>
                      <td>{producto.talle}</td>
                      <td>{producto.cantidad}</td>
                      {this.state.estado === 'pendiente' && <td>
                        <button 
                          type="button"
                          className="btn btn-outline-success"
                          onClick={()=>this.eliminarProducto(i)}
                          >X</button>
                      </td>}
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