import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'

import IssueList from './IssueList.jsx'
import Link from './Link.jsx'

const contentNode = document.getElementById('contents')
const noMatch = () => <p>Page Not Found</p>

const RoutedApp = () => (
  <Router history={hashHistory} >
    <Route path="/" component={IssueList} />
    <Route path="/link" component={Link} />
    <Route path="*" component={noMatch} />
  </Router>
)

ReactDOM.render(<RoutedApp />, contentNode) // Render the component inside the content Node
//Para solucionar error, volver React y react-dom a version anterior