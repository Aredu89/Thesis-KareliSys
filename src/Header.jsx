import React from'react'
import { Link } from 'react-router'
import 'whatwg-fetch'

export default class Header extends React.Component {
  constructor() {
    super()
    this.state = {

    }
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
                <Link className="nav-link" to="/">Usuarios</Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" 
                  data-toggle="dropdown" 
                  href="#" role="button" 
                  aria-haspopup="true" 
                  aria-expanded="false">Fábricas</a>
                <div className="dropdown-menu">
                  <Link className="dropdown-item" to="#">Gestión de Fábricas</Link>
                  <Link className="dropdown-item" to="#">Gestión de Pagos</Link>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" 
                  data-toggle="dropdown" 
                  href="#" role="button" 
                  aria-haspopup="true" 
                  aria-expanded="false">Clientes</a>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="#">Gestión de Clientes</a>
                  <a className="dropdown-item" href="#">Gestión de Cobros</a>
                </div>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">Stock</Link>
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
                  <a className="logout dropdown-item" href="#">Cerrar Sesión</a>
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