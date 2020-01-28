import React from 'react'

export default class ContactosEditar extends React.Component {
  constructor() {
    super()
    this.state={
      _id: "",
      fecha: "",
      detalle: [],
      precioTotal: "",
      estado: ""
    }
    this.handleOnChange = this.handleOnChange.bind(this)
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
  }

  onSave(){
    this.props.onSave({
      _id: this.state._id,
      fecha: this.state.fecha,
      detalle: this.state.detalle,
      precioTotal: this.state.precioTotal,
      estado: this.state.estado
    }, "pedidos")
    this.props.onClose()
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
              className="form-control"
              id="precioTotal" 
              name="precioTotal"
              placeholder="Precio Total..."
              value={this.state.precioTotal}
              onChange={this.handleOnChange} 
              />
          </div>
          {/* Estado */}
          <div className="col-12 form-group text-center pt-2">
            <label>Estado</label>
            <div className="form-group">
              <select className="custom-select">
                <option value="a pagar">A pagar</option>
                <option value="pago parcial">Pago parcial</option>
                <option value="pagado">Pagado</option>
              </select>
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