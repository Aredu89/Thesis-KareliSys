import React from'react'
import { Link } from 'react-router'

export default class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      email: "",
      password: "",
      errorEmail: false,
      errorPassword: false,
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

  onLogin(){
    console.log("Login")
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}