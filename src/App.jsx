import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, Redirect, withRouter } from 'react-router'

import Header from './Header.jsx'
import Home from './Home.jsx'
import FabricasLista from './FabricasLista.jsx'

const contentNode = document.getElementById('contents')
const noMatch = () => <p>Page Not Found</p>

const RoutedApp = () => (
  <Router history={browserHistory} >
    <Redirect from="/" to="/home" />
    <Route path="/" component={Header} >
      <Route path="home" component={withRouter(Home)} />
      <Route path="fabricas" component={FabricasLista} />
      <Route path="*" component={noMatch} />
    </Route>
  </Router>
)

ReactDOM.render(<RoutedApp />, contentNode)