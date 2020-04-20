import React from 'react'
import funciones from '../common/javascriptFunctions.js'

const estados = [
  {
    label: "Pendiente",
    value: "pendiente"
  },
  {
    label: "Entregado",
    value: "entregado"
  }
]

export default class ContactosEditar extends React.Component {
  constructor() {
    super()
    this.state={
      _id: "",
      fecha: "",
      detalle: [],
      errorDetalle: false,
      precioTotal: "",
      errorPrecio: false,
      estado: estados[0].value,
      nombreProducto: "",
      errorNombreProducto: false,
      talleProducto: "",
      cantidadProducto: ""
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.agregarProducto = this.agregarProducto.bind(this)
    this.eliminarProducto = this.eliminarProducto.bind(this)
  }

  componentDidMount(){
    if(this.props.data){
      this.setState({
        _id: this.props.data._id,
        fecha: (this.props.data.fecha).toString(),
        detalle: this.props.data.detalle,
        precioTotal: this.props.data.precioTotal,
        estado: this.props.data.estado
      })
    }
  }

  handleOnChange(event){
    this.setState({
      [event.target.name]: event.target.value
    })
    //Limpio el error del precio
    if(event.target.name === "precioTotal" && this.state.errorPrecio == true){
      this.setState({
        errorPrecio: false
      })
    }
    //Limpio el error del nombre del producto
    if(event.target.name === "nombreProducto" && this.state.errorNombreProducto == true){
      this.setState({
        errorNombreProducto: false
      })
    }
  }

  agregarProducto(){
    let productos = this.state.detalle
    //controlar que el nombre tenga un valor
    if(this.state.nombreProducto){
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
      this.setState({
        errorNombreProducto: true
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
    if(this.state.precioTotal > 0 && this.state.detalle.length > 0){
      this.props.onSave({
        _id: this.state._id,
        fecha: this.state.fecha ? this.state.fecha : new Date(),
        detalle: this.state.detalle,
        precioTotal: this.state.precioTotal,
        estado: this.state.estado
      }, "pedidos")
      this.props.onClose()
    } else {
      if(this.state.detalle.length < 1){
        this.setState({
          errorDetalle: true
        })
      }
      if(this.state.precioTotal < 1){
        this.setState({
          errorPrecio: true
        })
      }
    }
  }

  render(){
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
          {/* Fecha */}
          {
            this.state.fecha ?
              <div className="col-12 form-group text-center pt-2">
                <label className="mb-0">{`Fecha: ${funciones.formatearDate(this.state.fecha)}`}</label>
              </div>
            : null
          }
          {/* Precio Total */}
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
          {/* Estado */}
          <div className="col-12 form-group text-center pt-2">
            <label>Estado</label>
            <div className="form-group">
              <select className="custom-select"
                id="estado"
                name="estado"
                value={this.state.estado}
                onChange={this.handleOnChange}
              >
                {
                  estados.map((estado, i)=>{
                    return <option value={estado.value} key={i}>{estado.label}</option>
                  })
                }
              </select>
            </div>
          </div>
          {/* Productos */}
          <div className="col-12 form-group text-center pt-2">
            <label>Agregar productos al pedido</label>
            <div className="contenedor-productos">
              <label>Nombre</label>
              <input type="text" 
                className={this.state.errorNombreProducto ? "form-control is-invalid" : "form-control"}
                id="nombreProducto" 
                name="nombreProducto"
                placeholder="Nombre del producto..."
                value={this.state.nombreProducto}
                onChange={this.handleOnChange} 
                />
              <div className="d-flex justify-content-between">
                <div className="text-center">
                  <label>Talle</label>
                  <input type="number" 
                    className="form-control"
                    id="talleProducto" 
                    name="talleProducto"
                    placeholder="Talle..."
                    value={this.state.talleProducto}
                    onChange={this.handleOnChange} 
                    />
                </div>
                <div className="text-center">
                  <label>Cantidad</label>
                  <input type="number" 
                    className="form-control"
                    id="cantidadProducto" 
                    name="cantidadProducto"
                    placeholder="Cantidad..."
                    value={this.state.cantidadProducto}
                    onChange={this.handleOnChange} 
                    />
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
          {/* Error */}
          {this.state.errorDetalle ?
            <div className="col-12 form-group text-center pt-2">
              <div className="alert alert-dismissible alert-danger">
                <button type="button" className="close" data-dismiss="alert">&times;</button>
                <strong>Error!</strong> El pedido debe tener productos
              </div>
            </div>
          : null}
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