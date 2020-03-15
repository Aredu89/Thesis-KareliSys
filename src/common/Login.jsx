import React from'react'
import { Link } from 'react-router'
import axios from 'axios'
import { setToken } from "./js/setAuthToken.js"
import jwt_decode from "jwt-decode"

export default class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      email: "",
      password: "",
      errorEmail: false,
      errorPassword: false,
      pending: false,
      error: ""
    }
    this.handleOnChange = this.handleOnChange.bind(this)
  }

  //Manejo de cambios en el formulario
  handleOnChange(event){
    this.setState({
      [event.target.name]: event.target.value
    })
    //Quito el error del campo obligatorio
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
  }

  onLogin(){
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
    if(
      this.state.email &&
      this.state.password
    ){
      this.loguearUsuario()
    }
  }

  loguearUsuario(){
    const userData = {
      email: this.state.email,
      password: this.state.password
    }
    this.setState({
      pending: true,
      error: ""
    })
    axios
      .post("/api/loguear-usuario", userData)
      .then(res=>{
        //Guardar el token en el localStorage
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        // Set token to Auth header
        setToken(token);
        // Decode token to get user data
        const decoded = jwt_decode(token);
        // Set current user
        localStorage.setItem("currentUser", decoded);
        localStorage.setItem("userName", res.data.user.name);
        // Voy al home
        window.location.href = "./home"
      })
      .catch(err=>{
        this.setState({
          pending: false,
          error: "Usuario o password incorrecto"//err.message
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
              {/* Email */}
              <label>Email</label>
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
              {/* Registrarse */}
              <div className="col-12 text-center mt-2">
                <Link to="/registrarse" >Registrarse</Link>
              </div>
              {/* Boton */}
              <div className="col-12 form-group text-center mt-2 pt-2 boton-guardar">
                <button 
                  type="button"
                  className="btn btn-success"
                  onClick={()=>this.onLogin()}
                  >Iniciar Sesión</button>
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