import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, Redirect, withRouter } from 'react-router'

import Header from './common/Header.jsx'
import Home from './Home.jsx'
import FabricasLista from './fabricas/FabricasLista.jsx'
import FabricasEditar from './fabricas/FabricasEditar.jsx'
import StockLista from './stock/StockLista.jsx'
import StockEditar from './stock/StockEditar.jsx'

const contentNode = document.getElementById('contents')
const noMatch = () => <p>Page Not Found</p>

const RoutedApp = () => (
  <Router history={browserHistory} >
    <Redirect from="/" to="/home" />
    <Route path="/" component={Header} >
      <Route path="home" component={withRouter(Home)} />
      <Route path="fabricas" component={FabricasLista} />
      <Route path="fabricas/editar" component={FabricasEditar} />
      <Route path="fabricas/editar/:id" component={FabricasEditar} />
      <Route path="stock" component={StockLista} />
      <Route path="stock/editar" component={StockEditar} />
      <Route path="stock/editar/:id" component={StockEditar} />
      <Route path="*" component={noMatch} />
    </Route>
  </Router>
)

ReactDOM.render(<RoutedApp />, contentNode)