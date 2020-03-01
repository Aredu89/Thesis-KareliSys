import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, Redirect, withRouter, Switch } from 'react-router'

import jwt_decode from "jwt-decode"
import { setToken } from './common/js/setAuthToken.js'

import Header from './common/Header.jsx'
import Home from './common/Home.jsx'
import Login from './common/Login.jsx'
import Registrarse from './common/Registrarse.jsx'
import FabricasLista from './fabricas/FabricasLista.jsx'
import FabricasEditar from './fabricas/FabricasEditar.jsx'
import FabricasPagos from './fabricas/FabricasPagos.jsx'
import ClientesLista from './clientes/ClientesLista.jsx'
import ClientesEditar from './clientes/ClientesEditar.jsx'
import ClientesPagos from './clientes/ClientesPagos.jsx'
import StockLista from './stock/StockLista.jsx'
import StockEditar from './stock/StockEditar.jsx'

const contentNode = document.getElementById('contents')
const noMatch = () => <p>Page Not Found</p>

// Controlo el token para mantener al usuario logueado
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set current user
  localStorage.setItem("currentUser", decoded);
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
  return(
  <Router history={browserHistory} >
    <Redirect from="/" to="/home" />
    <Route path="/login" component={Login} />
    <Route path="/registrarse" component={Registrarse} />
    { user ? (
      <Route path="/" component={Header} >
        <Route path="home" component={withRouter(Home)} />
        <Route path="fabricas" component={FabricasLista} />
        <Route path="fabricas/editar" component={FabricasEditar} />
        <Route path="fabricas/editar/:id" component={FabricasEditar} />
        <Route path="fabricas/pagos/:id" component={FabricasPagos} />
        <Route path="clientes" component={ClientesLista} />
        <Route path="clientes/editar" component={ClientesEditar} />
        <Route path="clientes/editar/:id" component={ClientesEditar} />
        <Route path="clientes/pagos/:id" component={ClientesPagos} />
        <Route path="stock" component={StockLista} />
        <Route path="stock/editar" component={StockEditar} />
        <Route path="stock/editar/:id" component={StockEditar} />
        <Route path="*" component={noMatch} />
      </Route>
      ) : (
        <Redirect from="/*" to="/login" />
      )
    }
  </Router>
)}

ReactDOM.render(<RoutedApp />, contentNode)