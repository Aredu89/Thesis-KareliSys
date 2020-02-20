import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, Redirect, withRouter } from 'react-router'

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

const RoutedApp = () => (
  <Router history={browserHistory} >
    <Redirect from="/" to="/home" />
    <Route path="/login" component={Login} />
    <Route path="/registrarse" component={Registrarse} />
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
  </Router>
)

ReactDOM.render(<RoutedApp />, contentNode)