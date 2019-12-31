import React from 'react'

export default class ContactosEditar extends React.Component {
  constructor() {
    super()
    this.state={
      nombre: "",
      apellido: "",
      email: "",
      telefono: ""
    }
    this.handleOnChange = this.handleOnChange.bind(this)
  }

  handleOnChange(event){
    this.setState({
      [event.target.name]: event.target.value
    })
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
        <div className="formulario">
          <div className="col-12 form-group text-center pt-2">
            <label>Nombre</label>
            <input type="text" 
              className="form-control"
              id="nombre" 
              name="nombre"
              placeholder="Nombre..."
              value={this.state.nombre}
              onChange={this.handleOnChange} 
              />
          </div>
          <div className="col-12 form-group text-center pt-2">
            <label>Apellido</label>
            <input type="text" 
              className="form-control"
              id="apellido" 
              name="apellido"
              placeholder="Apellido..."
              value={this.state.apellido}
              onChange={this.handleOnChange} 
              />
          </div>
          <div className="col-12 form-group text-center pt-2">
            <label>Email</label>
            <input type="text" 
              className="form-control"
              id="email" 
              name="email"
              placeholder="Email..."
              value={this.state.email}
              onChange={this.handleOnChange} 
              />
          </div>
          <div className="col-12 form-group text-center pt-2">
            <label>Teléfono</label>
            <input type="text" 
              className="form-control"
              id="telefono" 
              name="telefono"
              placeholder="Teléfono..."
              value={this.state.telefono}
              onChange={this.handleOnChange} 
              />
          </div>
        </div>
      </div>
    )
  }
}