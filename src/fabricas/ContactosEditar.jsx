import React from 'react'

export default class ContactosEditar extends React.Component {
  constructor() {
    super()
    this.state={
      _id: "",
      nombre: "",
      errorNombre: false,
      apellido: "",
      email: "",
      telefono: ""
    }
    this.handleOnChange = this.handleOnChange.bind(this)
  }

  componentDidMount(){
    if(this.props.data){
      this.setState({
        _id: this.props.data._id,
        nombre: this.props.data.nombre,
        apellido: this.props.data.apellido,
        email: this.props.data.email,
        telefono: this.props.data.telefono
      })
    }
  }

  handleOnChange(event){
    this.setState({
      [event.target.name]: event.target.value
    })
    if(event.target.name === "nombre"){
      this.setState({
        errorNombre: false
      })
    }
  }

  onSave(){
    if(!this.state.nombre){
      this.setState({
        errorNombre: true
      })
    } else {
      this.props.onSave({
        _id: this.state._id,
        nombre: this.state.nombre,
        apellido: this.state.apellido,
        email: this.state.email,
        telefono: this.state.telefono
      }, "contactos")
      this.props.onClose()
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
          <div className="col-12 form-group text-center pt-2">
            <label>Nombre</label>
            <input type="text" 
              className={this.state.errorNombre ? "form-control is-invalid":"form-control"}
              id="nombre" 
              name="nombre"
              placeholder="Nombre..."
              value={this.state.nombre}
              onChange={this.handleOnChange} 
              />
            {/* Mensaje de error */}
            {
              this.state.errorNombre ?
              <div className="invalid-feedback">El nombre es requerido</div>
              : null
            }
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