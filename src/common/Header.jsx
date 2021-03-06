import React from'react'
import { Link } from 'react-router'
import { setToken } from "./js/setAuthToken.js"
import 'whatwg-fetch'

export default class Header extends React.Component {
  constructor() {
    super()
    this.state = {
      userName: "",
      currentUser: null
    }
  }

  componentDidMount(){
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    this.setState({
      userName: localStorage.getItem("userName"),
      currentUser: currentUser
    })
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
    let permits = {}
    let permitsAdmin = false
    if(this.state.currentUser){
      permits = this.state.currentUser.permits ? this.state.currentUser.permits : {}
      permitsAdmin = this.state.currentUser.permitsAdmin ? this.state.currentUser.permitsAdmin : false
    }
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
              {permits.fabricas && <li className="nav-item">
                <Link className="nav-link" to="/fabricas">Fábricas</Link>
              </li>}
              {permits.clientes && <li className="nav-item">
                <Link className="nav-link" to="/clientes">Clientes</Link>
              </li>}
              {permits.stock && <li className="nav-item">
                <Link className="nav-link" to="/stock">Stock</Link>
              </li>}
              {
                permits.reportes &&
                <div className="nav-item dropdown mr-sm-2">
                  <a className="nav-link dropdown-toggle" 
                    data-toggle="dropdown" 
                    href="#" role="button" 
                    aria-haspopup="true" 
                    aria-expanded="false">
                      Reportes
                    </a>
                  <div className="dropdown-menu">
                    <Link className="dropdown-item" to="/reportes/resultados">Resultados</Link>
                    <div className="dropdown-divider"></div>
                    <Link className="dropdown-item" to="/reportes/egresos-fecha">Egresos por fecha</Link>
                    <div className="dropdown-divider"></div>
                    <Link className="dropdown-item" to="/reportes/ingresos-fecha">Ingresos por fecha</Link>
                  </div>
                </div>
              }
              {permitsAdmin && <li className="nav-item">
                <Link className="nav-link" to="/usuarios">Usuarios</Link>
              </li>}
            </ul>
            <div className="form-inline my-2 my-lg-0">
              <div className="nav-item dropdown mr-sm-2">
                <a className="user-name nav-link dropdown-toggle" 
                  data-toggle="dropdown" 
                  href="#" role="button" 
                  aria-haspopup="true" 
                  aria-expanded="false">
                    {
                      this.state.userName ?
                        <span>
                          {this.state.userName}
                        </span>
                      :
                        // Spinner
                        <div className="spinner-border text-light" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                    }
                  </a>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="/usuarios">Opciones de Usuario</a>
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