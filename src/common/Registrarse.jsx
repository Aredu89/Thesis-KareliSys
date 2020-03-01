import React from'react'
import { Link } from 'react-router'
import axios from 'axios'
import Swal from 'sweetalert2' //https://github.com/sweetalert2/sweetalert2

export default class Registrarse extends React.Component {
  constructor() {
    super()
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errorName: false,
      errorEmail: false,
      errorPassword: false,
      errorPassword2: false,
      pending: false,
      error: ""
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.registrarUsuario = this.registrarUsuario.bind(this)
  }

  //Manejo de cambios en el formulario
  handleOnChange(event){
    this.setState({
      [event.target.name]: event.target.value
    })
    //Quito errores de los campos obligatorios
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

  onRegistrarse(){
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
    if(!this.state.password){
      this.setState({
        errorPassword: true
      })
    }
    if(!this.state.password2){
      this.setState({
        errorPassword2: true
      })
    }
    if(
      this.state.name &&
      this.state.email &&
      this.state.password &&
      this.state.password2
    ) {
      this.registrarUsuario()
    }
  }

  registrarUsuario(){
    const userData = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    }
    this.setState({
      pending: true
    })
    axios
      .post("/api/registrar-usuario", userData)
      .then(res => {
        this.setState({
          pending: false
        })
        Swal.fire(
          "Usuario registrado",
          "",
          "success"
        ).then(
          ()=>{
            this.props.history.push("/login") // se redirecciona al login
          })
        })
      .catch(err=>{
        this.setState({
          pending: false,
          error: err
        })
      })
  }

  render() {
    return (
      <div className="login">
        <div className="row d-flex justify-content-center">
          {/* Card Login */}
          <div className="col-lg-4 col-md-6 col-10 card border-primary p-0">
            <div className="card-header text-center"><h4>KareliSys</h4></div>
            <div className="card-body text-center">
              {/* Nombre */}
              <label>Nombre</label>
              <input type="text" 
                className={this.state.errorName ? "form-control is-invalid" : "form-control"}
                id="name" 
                name="name"
                placeholder="Nombre..."
                value={this.state.name}
                onChange={this.handleOnChange} />
              {/* Email */}
              <label className="mt-3">Email</label>
              <input type="email" 
                className={this.state.errorEmail ? "form-control is-invalid" : "form-control"}
                id="email" 
                name="email"
                placeholder="Email..."
                value={this.state.email}
                onChange={this.handleOnChange} />
              {/* Password */}
              <label className="mt-3">Password</label>
              <input type="password" 
                className={this.state.errorPassword ? "form-control is-invalid" : "form-control"}
                id="password" 
                name="password"
                placeholder="Password..."
                value={this.state.password}
                onChange={this.handleOnChange} />
              {/* Password */}
              <label className="mt-3">Confirmar password</label>
              <input type="password" 
                className={this.state.errorPassword2 ? "form-control is-invalid" : "form-control"}
                id="password2" 
                name="password2"
                placeholder="Confirmar password..."
                value={this.state.password2}
                onChange={this.handleOnChange} />
              {/* Iniciar Sesión */}
              <div className="col-12 text-center mt-2">
                <Link to="/login" >¿Ya posee una cuenta? Iniciar Sesión</Link>
              </div>
              {/* Boton */}
              <div className="col-12 form-group text-center mt-2 pt-2 boton-guardar">
                <button 
                  type="button"
                  className="btn btn-success"
                  onClick={()=>this.onRegistrarse()}
                  >Registrarse</button>
              </div>
              {/* Spinner */}
              {
                this.state.pending ? (
                  <div className="col-12 form-group text-center mt-2 pt-2 boton-guardar">
                    <div className="spinner-border text-light" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  this.state.error ? (
                    //Mensaje de error
                    <div className="col-12 form-group text-center mt-2 pt-2 boton-guardar">
                      <div className="alert alert-dismissible alert-danger">
                        <button type="button" className="close" data-dismiss="alert">&times;</button>
                        <strong>Error!</strong> {this.state.error}
                      </div>
                    </div>
                  ) : (null)
                )
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}