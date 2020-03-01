import React from'react'
import { Link } from 'react-router'
import { setToken } from "./js/setAuthToken.js"
import 'whatwg-fetch'

export default class Header extends React.Component {
  constructor() {
    super()
    this.state = {

    }
  }

  logOut(){
    // Remove token from local storage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setToken(false);
    // Set current user to empty object {} which will set isAuthenticated to false
    localStorage.removeItem("currentUser");
    // voy al login
    this.props.history.push("/login")
  }

  render() {
    return (
      <div className="header">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <Link className="navbar-brand" to="/">KareliSys</Link>
          <button 
            className="navbar-toggler collapsed" 
            type="button" 
            data-toggle="collapse"
            data-target="#navbarColor01" 
            aria-controls="navbarColor01" 
            aria-expanded="false" 
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="navbar-collapse collapse" id="navbarColor01">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/fabricas">Fábricas</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/clientes">Clientes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/stock">Stock</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">Usuarios</Link>
              </li>
            </ul>
            <div className="form-inline my-2 my-lg-0">
              <div className="nav-item dropdown mr-sm-2">
                <a className="user-name nav-link dropdown-toggle" 
                  data-toggle="dropdown" 
                  href="#" role="button" 
                  aria-haspopup="true" 
                  aria-expanded="false">Ariel Rosales</a>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="#">Opciones de Usuario</a>
                  <div className="dropdown-divider"></div>
                  <span className="logout dropdown-item" 
                    onClick={()=>{this.logOut()}}>Cerrar Sesión</span>
                </div>
              </div>
              <div className="profile-image"><span>A</span></div>
            </div>
          </div>
        </nav>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    )
  }
}