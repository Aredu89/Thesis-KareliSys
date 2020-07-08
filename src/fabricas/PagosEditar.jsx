import React from 'react'
import funciones from '../common/javascriptFunctions.js'
import DatePicker from '../common/DatePicker.jsx'

export default class PagosEditar extends React.Component {
  constructor() {
    super()
    this.state={
      _id: "",
      errorFecha: false,
      errorFormatoFecha: "",
      fecha: "",
      errorMonto: "",
      monto: "",
      montoAdeudado: 0,
      formaPago: "",
      errorFormaPago: "",
      factura: null,
      errorFactura: "",
      observaciones: "",
      error: ""
    }
    this.handleOnChange = this.handleOnChange.bind(this)
  }
  componentDidMount(){
    if(this.props.data){
      this.setState({
        _id: this.props.data._id,
        fecha: this.props.data.fecha ? funciones.fechaANumeros(this.props.data.fecha) : "",
        monto: this.props.data.monto,
        formaPago: this.props.data.formaPago,
        factura: this.props.data.factura,
        observaciones: this.props.data.observaciones
      })
    }
    if(this.props.pedidoAPagar){
      let auxMontoAdeudado = funciones.getDeudaPedido(this.props.pedidoAPagar)
      if(this.props.data._id){
        auxMontoAdeudado = auxMontoAdeudado + this.props.data.monto
      }
      this.setState({
        montoAdeudado: auxMontoAdeudado
      })
      console.log("Pedido a pagar: ",this.props.pedidoAPagar)
    }
  }
  handleOnChange(event){
    this.setState({
      [event.target.name]: event.target.value
    })
    // Borro el error del campo
    if(event.target.name === "monto"){
      this.setState({
        errorMonto: ""
      })
    }
    if(event.target.name === "fecha"){
      this.setState({
        errorFecha: false,
        errorFormatoFecha: ""
      })
    }
    if(event.target.name === "formaPago"){
      this.setState({
        errorFormaPago: ""
      })
    }
    if(event.target.name === "factura"){
      this.setState({
        errorFactura: ""
      })
    }
  }

  onSave(){
    if(this.props.pedidoAPagar){
      let errorValidacion = false
      let fechaPago = new Date()
      // Seteo errores si es que existen
      if(!this.state.fecha){
        errorValidacion = true
        this.setState({
          errorFecha: true
        })
      } else {
        fechaPago = funciones.numerosAFecha(this.state.fecha)
      }
      if(
        isNaN(Date.parse(fechaPago))
        ){
        errorValidacion = true
        this.setState({
          errorFormatoFecha: "Ingrese una fecha válida en formato dd/mm/yyyy"
        })
      }
      if(this.state.monto > this.state.montoAdeudado){
        errorValidacion = true
        this.setState({
          errorMonto: "El monto no puede superar la deuda a pagar"
        })
      }
      if(this.state.monto < 1){
        errorValidacion = true
        this.setState({
          errorMonto: "El monto debe ser mayor a cero"
        })
      }
      if(!this.state.formaPago){
        errorValidacion = true
        this.setState({
          errorFormaPago: "Ingrese una forma de pago"
        })
      }
      if(!this.state.factura){
        errorValidacion = true
        this.setState({
          errorFactura: "Ingrese el número de factura"
        })
      }
      // Si no hay errores, guardo
      if(
        !errorValidacion
        ){
        this.props.onSave({
          _id: this.state._id,
          fecha: this.state.fecha ? funciones.numerosAFecha(this.state.fecha) : new Date(),
          monto: this.state.monto,
          formaPago: this.state.formaPago,
          factura: this.state.factura,
          observaciones: this.state.observaciones,
          pedidoId: this.props.pedidoAPagar._id
        })
        this.props.onClose()
      } else {
        console.log("Error en validacion de datos")
      }
    } else {
      console.log("No hay un pedido asociado")
      this.setState({
        error: "No hay un pedido a pagar asociado"
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
            {/* Mensaje de error por formato */}
            {
              this.state.errorFormatoFecha ?
              <div className="alerta-feedback">{this.state.errorFormatoFecha}</div>
              : null
            }
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
              className={this.state.errorFormaPago ? "form-control is-invalid":"form-control"}
              id="formaPago" 
              name="formaPago"
              placeholder="Forma de Pago..."
              value={this.state.formaPago}
              onChange={this.handleOnChange} 
              />
            {/* Mensaje de error */}
            {
              this.state.errorFormaPago ?
              <div className="invalid-feedback">{this.state.errorFormaPago}</div>
              : null
            }
          </div>
          {/* Factura */}
          <div className="col-12 form-group text-center pt-2">
            <label>Factura N°</label>
            <input type="number" 
              className={this.state.errorFactura ? "form-control is-invalid":"form-control"}
              id="factura" 
              name="factura"
              placeholder="Factura N°..."
              value={this.state.factura}
              onChange={this.handleOnChange} 
              />
            {/* Mensaje de error */}
            {
              this.state.errorFactura ?
              <div className="invalid-feedback">{this.state.errorFactura}</div>
              : null
            }
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