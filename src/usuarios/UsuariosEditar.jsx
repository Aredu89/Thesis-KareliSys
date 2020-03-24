import React from 'react'
import Swal from 'sweetalert2' //https://github.com/sweetalert2/sweetalert2

export default class UsuariosEditar extends React.Component {
  constructor() {
    super()
    this.state = {
      nuevo: true,
      cargando: false, // Cambiar
      error: "",
      _id: "",
      //Campos del formulario
      name: "",
      email: "",
      password: "",
      password2: "",
      errorName: false,
      errorEmail: false,
      errorPassword: false,
      errorPassword2: false,
      permits: false
    }
    this.handleOnChange = this.handleOnChange.bind(this)
  }

  onClickGuardar(){

  }

  //Manejo de cambios en el formulario
  handleOnChange(event){
    if(event.target.type === "checkbox"){
      this.setState({
        [event.target.name]: event.target.checked
      })
    } else {
      this.setState({
        [event.target.name]: event.target.value
      })
    }
    //Quito el error del campo obligatorio
    if(event.target.name === "name"){
      this.setState({
        errorName: false
      })
    }
    if(event.target.name === "email"){
      this.setState({
        errorEmail: false
      })
    }
    if(event.target.name === "password"){
      this.setState({
        errorPassword: false
      })
    }
    if(event.target.name === "password2"){
      this.setState({
        errorPassword2: false
      })
    }
  }

  render() {
    return (
      <div className="usuarios-editar text-center">
        {!this.state.cargando ?
          <div> 
            <div className="row">
              <div className="col-12 d-flex justify-content-between">
                {/* Titulo */}
                {
                  this.state.nuevo ?
                    <h3>Crear Usuario</h3>
                  :
                    <h3>Modificar usuario: {this.state.name}</h3>
                }
                {/* Boton para guardar cambios */}
                <div>
                  <button type="button" 
                    className="btn btn-success"
                    onClick={() => this.onClickGuardar()}
                    >+ Guardar</button>
                </div>
              </div>
            </div>
            {/* Formulario */}
            <div className="row pt-3 text-center">
              {/* Permisos */}
              <div className="col-12 d-flex justify-content-between">
                <span>¿Permisos para utilizar el sistema?</span>
                <input 
                  type="checkbox"
                  className="form-control"
                  id="permits"
                  name="permits"
                  checked={this.state.permits}
                  onChange={this.handleOnChange}
                />
              </div>
              {/* Nombre */}
              <div className="col-sm-6 col-12 form-group">
                <label>Nombre de usuario</label>
                <input type="text" 
                  className={this.state.errorName ? "form-control is-invalid" : "form-control"}
                  id="name" 
                  name="name"
                  placeholder="Nombre de Usuario..."
                  value={this.state.name}
                  onChange={this.handleOnChange} />
                {
                  this.state.errorNombre ?
                  <div className="invalid-feedback">El nombre de usuario es requerido</div>
                  : null
                }
              </div>
              {/* Email */}
              <div className="col-sm-6 col-12 form-group">
                <label>Email</label>
                <input type="text" 
                  className={this.state.errorEmail ? "form-control is-invalid" : "form-control"}
                  id="email" 
                  name="email"
                  placeholder="Email..."
                  value={this.state.email}
                  onChange={this.handleOnChange} />
                {
                  this.state.errorNombre ?
                  <div className="invalid-feedback">El email es requerido</div>
                  : null
                }
              </div>

            </div>
          </div>
          :
          this.state.error ?
            //Mensaje de error
            <div className="alert alert-dismissible alert-danger">
              <button type="button" className="close" data-dismiss="alert">&times;</button>
              <strong>Error!</strong> {this.state.error}
            </div>
          :
            // Spinner
            <div className="spinner-border text-light" role="status">
              <span className="sr-only">Loading...</span>
            </div>
        }
      </div>
    )
  }
}