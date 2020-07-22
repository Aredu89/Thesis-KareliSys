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
      errorCantidadStock: false,
      productosDisponibles: [],
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
        pagos: this.props.data.pagos ? this.props.data.pagos : []
      })
    }
    if(this.props.productos){
      this.setState({
        productosDisponibles: this.props.productos
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
        errorCantidadProducto: false,
        errorCantidadStock: false
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
      //Controlo la cantidad según stock
      let stock = null
      this.state.productosDisponibles.forEach(pr=>{
        if(pr.producto === this.state.nombreProducto && Number(pr.talle) === Number(this.state.talleProducto)){
          stock = pr
        }
      })
      if(stock){
        let cantidadProductos = this.state.cantidadProducto
        //Sumo los productos que ya están en el pedido
        productos.forEach(produc => {
          if(
            produc.producto === stock.producto &&
            Number(produc.talle) === Number(stock.talle)
          ){
            cantidadProductos = cantidadProductos + produc.cantidad
          }
        })
        if(cantidadProductos > stock.cantidad){
          this.setState({
            errorCantidadProducto: true,
            errorCantidadStock: true
          })
        } else {
          //Si hay cantidad suficiente en stock, entonces agrego el producto
          productos.push({
            producto: this.state.nombreProducto,
            talle: this.state.talleProducto,
            cantidad: this.state.cantidadProducto
          })
          this.setState({
            detalle: productos,
            errorDetalle: false
          })
        }
      } else {
        this.setState({
          errorCantidadProducto: true,
          errorCantidadStock: true
        })
      }
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
        fechaPedido: this.state.fechaPedido ? funciones.numerosAFecha(this.state.fechaPedido) : new Date(),
        fechaEntrega: this.state.fechaEntrega ? funciones.numerosAFecha(this.state.fechaEntrega) : null,
        fechaEntregado: this.state.fechaEntregado ? funciones.numerosAFecha(this.state.fechaEntregado) : null,
        detalle: this.state.detalle,
        pagos: this.state.pagos ? this.state.pagos : [],
        precioTotal: this.state.precioTotal ? Number(this.state.precioTotal) : null,
        estado: this.state.estado
      })
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

  render(){
    //Cargo productos disponibles en el select
    let productosOptions = []
    this.state.productosDisponibles.forEach(prod=>{
      const existeProducto = productosOptions.find(pr=>pr.value === prod.producto)
      if(!existeProducto){
        productosOptions.push({
          id: prod.producto,
          value: prod.producto
        })
      }
    })
    //Cargo talles disponibles
    let tallesOptions = []
    if(this.state.nombreProducto){
      this.state.productosDisponibles.forEach(prod=>{
        if(prod.producto === this.state.nombreProducto){
          const existeTalle = tallesOptions.find(tll=>tll.value === prod.talle)
          if(!existeTalle){
            tallesOptions.push({
              id: prod.talle,
              value: prod.talle
            })
          }
        }
      })
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
                disabled={this.state.pagos.length > 0 || this.state.fechaEntregado ? true : false}
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
                disabled={this.state.pagos.length > 0 ? true : false}
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
            this.state.fechaEntrega &&
            this.state.precioTotal &&
            <div className="col-12 form-group text-center pt-2">
              <label>Fecha Entregado</label>
              <DatePicker
                name="fechaEntregado"
                value={this.state.fechaEntregado ? this.state.fechaEntregado : ""}
                onChange={this.handleOnChange}
                />
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
                    this.state.errorCantidadStock ?
                    <div className="invalid-feedback">No hay suficiente stock</div>
                    :
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
                      <td>{producto.producto}</td>
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