import React from 'react'
import Swal from 'sweetalert2' //https://github.com/sweetalert2/sweetalert2
import axios from 'axios'

const permits = [
  "",
  "LEER",
  "CREAR",
  "MODIFICAR"
]

export default class UsuariosEditar extends React.Component {
  constructor() {
    super()
    this.state = {
      nuevo: true,
      cargando: true,
      pendingGuardar: false,
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
      permits: {},
      permitsAdmin: false
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnPermitsChange = this.handleOnPermitsChange.bind(this)
  }

  componentDidMount(){
    if(this.props.params.id){
      this.obtenerUsusario()
    } else {
      this.setState({
        cargando: false
      })
    }
  }

  obtenerUsusario(){
    fetch(`/api/usuarios/${this.props.params.id}`)
      .then(res =>{
        if(res.ok){
          res.json()
          .then(data =>{
            console.log("Usuario: ",data)
            this.setState({
              cargando: false,
              nuevo: false,
              _id: data._id,
              name: data.name,
              email: data.email,
              permitsAdmin: data.permitsAdmin,
              permits: data.permits ? data.permits : {}
            })
          })
        } else {
          res.json()
          .then(error=>{
            console.log("Error al obtener usuario - ",error.message)
            this.setState({
              cargando: false,
              error: error.message
            })
          })
        }
      })
      .catch(error => {
        console.log("Error en el fetch. ",error.message)
        this.setState({
          cargando: false,
          error: error.message
        })
      })
  }

  onClickGuardar(){
    if(!this.state.name){
      this.setState({
        errorName: true
      })
    }
    if(!this.state.email){
      this.setState({
        errorEmail: true
      })
    }
    if(!this.state.password && this.state.nuevo){
      this.setState({
        errorPassword: true
      })
    }
    if(!this.state.password2 && this.state.nuevo){
      this.setState({
        errorPassword2: true
      })
    }
    if(this.state.password !== this.state.password2){
      this.setState({
        errorPassword2: true
      })
    }
    if(
      this.state.name &&
      this.state.email &&
      (this.state.password || !this.state.nuevo) &&
      (this.state.password2 || !this.state.nuevo) &&
      this.state.password === this.state.password2
    ) {
      if(this.state.nuevo){
        // Se crea un nuevo usuario
        this.crearUsuario()
      } else {
        // Se modifica el usuario
        this.modificarUsuario()
      }
    }
  }

  modificarUsuario(){
    const userData = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      permits: this.state.permits,
      permitsAdmin: this.state.permitsAdmin
    }
    this.setState({
      pendingGuardar: true
    })
    axios
      .put(`/api/usuarios/${this.props.params.id}`, userData)
      .then(res => {
        this.setState({
          pendingGuardar: false
        })
        Swal.fire(
          "Usuario modificado",
          "",
          "success"
        ).then(
          ()=>{
            this.props.history.push("/usuarios") // se redirecciona a la lista
          })
      })
      .catch(err=>{
        this.setState({
          pendingGuardar: false
        })
        console.log("Error: ",err.response.data)
        Swal.fire(
          "Error al modificar usuario",
          err.response.data.message,
          "error"
        )
      })
  }

  crearUsuario(){
    const userData = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      permits: this.state.permits,
      permitsAdmin: this.state.permitsAdmin
    }
    this.setState({
      pendingGuardar: true
    })
    axios
      .post("/api/registrar-usuario", userData)
      .then(res => {
        this.setState({
          pendingGuardar: false
        })
        Swal.fire(
          "Usuario registrado",
          "",
          "success"
        ).then(
          ()=>{
            this.props.history.push("/usuarios") // se redirecciona a la lista
          })
        })
      .catch(err=>{
        this.setState({
          pendingGuardar: false
        })
        console.log("Error: ",err)
        Swal.fire(
          "Error al registrar usuario",
          err.message,
          "error"
        )
      })
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

  handleOnPermitsChange(event){
    const { name, value } = event.target
    let permits = this.state.permits
    permits[name] = value ? value : ""
    this.handleOnChange({
      target: {
        type: "",
        name: "permits",
        value: permits
      }
    })
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
                  >{this.state.pendingGuardar ?
                    // Spinner
                    <div className="spinner-border text-light" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                   : "+ Guardar"}</button>
                </div>
              </div>
            </div>
            {/* Formulario */}
            <div className="row pt-3 text-center">
              {/* Permisos */}
              <div className="col-12">
                <div className="contenedor-permisos">
                  <div className="col-12 d-flex justify-content-center align-items-center mb-3">PERMISOS:</div>
                  <div className="col-12 d-flex justify-content-between align-items-center mb-3">
                    <span className="col-6">¿Permisos de administrador?</span>
                    <input 
                      type="checkbox"
                      className="col-6 form-control checkbox-permits"
                      id="permitsAdmin"
                      name="permitsAdmin"
                      checked={this.state.permitsAdmin}
                      onChange={this.handleOnChange}
                    />
                  </div>
                  <div className="row">
                    <div className="col-12 col-sm-6 d-flex justify-content-between align-items-center mb-3 pr-4">
                      <span className="col-6">Home</span>
                      <select className="custom-select"
                        id="home"
                        name="home"
                        value={this.state.permits.home ? this.state.permits.home : ""}
                        onChange={this.handleOnPermitsChange}
                      >
                        {
                          permits.map((permit, i)=>{
                            return <option value={permit} key={i}>{permit ? permit : "No"}</option>
                          })
                        }
                      </select>
                    </div>
                    <div className="col-12 col-sm-6 d-flex justify-content-between align-items-center mb-3 pr-4">
                      <span className="col-6">Fabricas</span>
                      <select className="custom-select"
                        id="fabricas"
                        name="fabricas"
                        value={this.state.permits.fabricas ? this.state.permits.fabricas : ""}
                        onChange={this.handleOnPermitsChange}
                      >
                        {
                          permits.map((permit, i)=>{
                            return <option value={permit} key={i}>{permit ? permit : "No"}</option>
                          })
                        }
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-sm-6 d-flex justify-content-between align-items-center mb-3 pr-4">
                      <span className="col-6">Clientes</span>
                      <select className="custom-select"
                        id="clientes"
                        name="clientes"
                        value={this.state.permits.clientes ? this.state.permits.clientes : ""}
                        onChange={this.handleOnPermitsChange}
                      >
                        {
                          permits.map((permit, i)=>{
                            return <option value={permit} key={i}>{permit ? permit : "No"}</option>
                          })
                        }
                      </select>
                    </div>
                    <div className="col-12 col-sm-6 d-flex justify-content-between align-items-center mb-3 pr-4">
                      <span className="col-6">Stock</span>
                      <select className="custom-select"
                        id="stock"
                        name="stock"
                        value={this.state.permits.stock ? this.state.permits.stock : ""}
                        onChange={this.handleOnPermitsChange}
                      >
                        {
                          permits.map((permit, i)=>{
                            return <option value={permit} key={i}>{permit ? permit : "No"}</option>
                          })
                        }
                      </select>
                    </div>
                  </div>
                </div>
                
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
                  this.state.errorName ?
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
                  this.state.errorEmail ?
                  <div className="invalid-feedback">El email es requerido</div>
                  : null
                }
              </div>
              {/* Password */}
              <div className="col-sm-6 col-12 form-group">
                <label>Password</label>
                <input type="password" 
                  className={this.state.errorPassword ? "form-control is-invalid" : "form-control"}
                  id="password" 
                  name="password"
                  placeholder="Password..."
                  value={this.state.password}
                  onChange={this.handleOnChange} />
                {
                  this.state.errorPassword ?
                  <div className="invalid-feedback">El password es requerido</div>
                  : null
                }
              </div>
              {/* Password 2 */}
              <div className="col-sm-6 col-12 form-group">
                <label>Confirme el password</label>
                <input type="password" 
                  className={this.state.errorPassword2 ? "form-control is-invalid" : "form-control"}
                  id="password2" 
                  name="password2"
                  placeholder="Confirme el password..."
                  value={this.state.password2}
                  onChange={this.handleOnChange} />
                {
                  this.state.errorPassword2 ?
                  <div className="invalid-feedback">El password debe coincidir</div>
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