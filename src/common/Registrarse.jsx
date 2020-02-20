import React from'react'
import { Link } from 'react-router'

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
  }

  onRegistrarse(){
    console.log("Registrarse")
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}