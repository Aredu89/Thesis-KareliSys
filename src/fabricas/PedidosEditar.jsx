import React from 'react'

export default class ContactosEditar extends React.Component {
  constructor() {
    super()
    this.state={
      _id: "",
      fecha: "",
      detalle: [],
      precioTotal: "",
      errorPrecio: false,
      estado: "",
      nombreProducto: "",
      errorNombreProducto: false,
      talleProducto: "",
      cantidadProducto: ""
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.agregarProducto = this.agregarProducto.bind(this)
  }

  componentDidMount(){
    if(this.props.data){
      this.setState({
        _id: this.props.data._id,
        fecha: this.props.data.fecha,
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
      productos.push({
        nombre: this.state.nombreProducto,
        talle: this.state.talleProducto,
        cantidad: this.state.cantidadProducto
      })
      this.setState({
        detalle: productos
      })
  }

  onSave(){
    if(this.state.precioTotal > 0){
      this.props.onSave({
        _id: this.state._id,
        fecha: this.state.fecha ? this.state.fecha : new Date(),
        detalle: this.state.detalle,
        precioTotal: this.state.precioTotal,
        estado: this.state.estado
      }, "pedidos")
      this.props.onClose()
    } else {
      this.setState({
        errorPrecio: true
      })
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
                <label>{this.state.fecha}</label>
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
                <option value="a pagar">A pagar</option>
                <option value="pago parcial">Pago parcial</option>
                <option value="pagado">Pagado</option>
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
                <div className="text-center d-flex align-items-center">
                  <button 
                    type="button"
                    className="btn btn-outline-success"
                    onClick={()=>this.agregarProducto()}
                    >+</button>
                </div>
              </div>
            </div>
          </div>
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