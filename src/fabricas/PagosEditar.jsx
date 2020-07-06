import React from 'react'
import funciones from '../common/javascriptFunctions.js'
import DatePicker from '../common/DatePicker.jsx'

export default class PagosEditar extends React.Component {
  constructor() {
    super()
    this.state={
      _id: "",
      errorFecha: false,
      fecha: "",
      errorMonto: "",
      monto: "",
      montoAdeudado: 0,
      formaPago: "",
      factura: null,
      observaciones: ""
    }
    this.handleOnChange = this.handleOnChange.bind(this)
  }
  componentDidMount(){
    if(this.props.data){
      this.setState({
        _id: this.props.data._id,
        fecha: this.props.data.fecha,
        monto: this.props.data.monto,
        formaPago: this.props.data.formaPago,
        factura: this.props.data.factura,
        observaciones: this.props.data.observaciones
      })
    }
    if(this.props.pedidoAPagar){
      this.setState({
        montoAdeudado: funciones.getDeudaPedido(this.props.pedidoAPagar)
      })
    }
  }
  handleOnChange(event){
    this.setState({
      [event.target.name]: event.target.value
    })
    if(event.target.name === "monto"){
      this.setState({
        errorMonto: ""
      })
    }
  }
  onSave(){
    if(this.state.monto > 0 && this.state.monto < this.props.deudaTotal){
      this.props.onSave({
        _id: this.state._id,
        fecha: this.state.fecha ? this.state.fecha : new Date(),
        monto: this.state.monto,
        formaPago: this.state.formaPago,
        observaciones: this.state.observaciones
      }, "pagos")
      this.props.onClose()
    } else if (this.state.monto > this.props.deudaTotal){
      this.setState({
        errorMonto: "El monto no puede superar la deuda total"
      })
    } else {
      this.setState({
        errorMonto: "El monto debe ser mayor a cero"
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
          <div className="col-12 form-group text-center pt-2">
            <label>Fecha</label>
            <DatePicker
              name="fecha"
              value={this.state.fecha ? this.state.fecha : ""}
              onChange={this.handleOnChange}
              error={this.state.errorFecha}
              disabled={this.state._id ? true : false}
              />
          </div>
          {/* Monto */}
          <div className="col-12 form-group text-center pt-2">
            <label>Monto</label>
            <input type="number" 
              className={this.state.errorMonto ? "form-control is-invalid":"form-control"}
              id="monto" 
              name="monto"
              placeholder="Monto..."
              value={this.state.monto}
              onChange={this.handleOnChange} 
              />
            {/* Mensaje de error */}
            {
              this.state.errorMonto ?
              <div className="invalid-feedback">{this.state.errorMonto}</div>
              : null
            }
          </div>
          {/* Forma de Pago */}
          <div className="col-12 form-group text-center pt-2">
            <label>Forma de Pago</label>
            <input type="text" 
              className="form-control"
              id="formaPago" 
              name="formaPago"
              placeholder="Forma de Pago..."
              value={this.state.formaPago}
              onChange={this.handleOnChange} 
              />
          </div>
          {/* Factura */}
          <div className="col-12 form-group text-center pt-2">
            <label>Factura N°</label>
            <input type="text" 
              className="form-control"
              id="factura" 
              name="factura"
              placeholder="Factura N°..."
              value={this.state.factura}
              onChange={this.handleOnChange} 
              />
          </div>
          {/* Observaciones */}
          <div className="col-12 form-group text-center pt-2">
            <label>Observaciones</label>
            <textarea
              className="form-control"
              rows="3"
              id="observaciones" 
              name="observaciones"
              placeholder="Observaciones..."
              value={this.state.observaciones}
              onChange={this.handleOnChange} 
              ></textarea>
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