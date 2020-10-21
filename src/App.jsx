import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, Redirect, withRouter } from 'react-router'

import jwt_decode from "jwt-decode"
import { setToken } from './common/js/setAuthToken.js'

import Header from './common/Header.jsx'
import Home from './common/Home.jsx'
import Login from './common/Login.jsx'
import Registrarse from './common/Registrarse.jsx'
import FabricasLista from './fabricas/FabricasLista.jsx'
import FabricasEditar from './fabricas/FabricasEditar.jsx'
import FabricasPedidos from './fabricas/FabricasPedidos.jsx'
import FabricasPagos from './fabricas/FabricasPagos.jsx'
import ClientesLista from './clientes/ClientesLista.jsx'
import ClientesEditar from './clientes/ClientesEditar.jsx'
import ClientesPedidos from './clientes/ClientesPedidos.jsx'
import ClientesPagos from './clientes/ClientesPagos.jsx'
import StockLista from './stock/StockLista.jsx'
import StockEditar from './stock/StockEditar.jsx'
import UsuariosLista from './usuarios/UsuariosLista.jsx'
import UsuariosEditar from './usuarios/UsuariosEditar.jsx'
import Resultados from './reportes/Resultados.jsx'
import EgresosFecha from './reportes/EgresosFecha.jsx'
import IngresosFecha from './reportes/IngresosFecha.jsx'

const contentNode = document.getElementById('contents')
const noMatch = () => <p>Page Not Found</p>
const noPermits = () => <p>Solicite permisos al administrador</p>

// Controlo el token para mantener al usuario logueado
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set current user
  localStorage.setItem("currentUser", JSON.stringify(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    // Remove token from local storage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setToken(false);
    // Set current user to empty object {} which will set isAuthenticated to false
    localStorage.removeItem("currentUser");
    // voy al login
    window.location.href = "./login";
  }
}

const RoutedApp = () => {
  const user = localStorage.getItem("currentUser")
  let parseUser = {}
  if(user){
    parseUser = JSON.parse(user)
    console.log("Current user: ",parseUser)
  }
  const permitsAdmin = parseUser.permitsAdmin ? parseUser.permitsAdmin : false
  const permits = parseUser.permits ? parseUser.permits : {}
  return(
  <Router history={browserHistory} >
    <Redirect from="/" to="/home" />
    <Route path="/login" component={Login} />
    <Route path="/registrarse" component={Registrarse} />
    { user ? (
        <Route path="/" component={Header} >
          <Route path="home" component={permits.home ? withRouter(Home) : withRouter(noPermits)} />
          <Route path="fabricas" component={permits.fabricas ? FabricasLista : noPermits} />
          <Route path="fabricas/editar" component={permits.fabricas ? FabricasEditar : noPermits} />
          <Route path="fabricas/editar/:id" component={permits.fabricas ? FabricasEditar : noPermits} />
          <Route path="fabricas/pedidos/:id" component={permits.fabricas ? FabricasPedidos : noPermits} />
          <Route path="fabricas/pagos/:id" component={permits.fabricas ? FabricasPagos : noPermits} />
          <Route path="clientes" component={permits.clientes ? ClientesLista : noPermits} />
          <Route path="clientes/editar" component={permits.clientes ? ClientesEditar : noPermits} />
          <Route path="clientes/editar/:id" component={permits.clientes ? ClientesEditar : noPermits} />
          <Route path="clientes/pedidos/:id" component={permits.clientes ? ClientesPedidos : noPermits} />
          <Route path="clientes/pagos/:id" component={permits.clientes ? ClientesPagos : noPermits} />
          <Route path="stock" component={permits.stock ? StockLista : noPermits} />
          <Route path="stock/editar" component={permits.stock ? StockEditar : noPermits} />
          <Route path="stock/editar/:id" component={permits.stock ? StockEditar : noPermits} />
          <Route path="usuarios" component={permitsAdmin ? UsuariosLista : noPermits} />
          <Route path="usuarios/editar" component={permitsAdmin ? UsuariosEditar : noPermits} />
          <Route path="usuarios/editar/:id" component={permitsAdmin ? UsuariosEditar : noPermits} />
          <Route path="reportes/resultados" component={permits.reportes ? Resultados : noPermits} />
          <Route path="reportes/egresos-fecha" component={permits.reportes ? EgresosFecha : noPermits} />
          <Route path="reportes/ingresos-fecha" component={permits.reportes ? IngresosFecha : noPermits} />
          <Route path="*" component={noMatch} />
        </Route>
      ) : (
        <Redirect from="/*" to="/login" />
      )
    }
  </Router>
)}

ReactDOM.render(<RoutedApp />, contentNode)