import React from'react'
import { Link } from 'react-router'

export default class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      email: "",
      password: "",
      error: ""
    }
  }

  render() {
    return (
      <div className="login">
        <div className="row d-flex justify-content-center">
          {/* Card Login */}
          <div className="col-lg-4 col-md-6 col-10 card border-primary p-0">
            <div className="card-header text-center">KareliSys</div>
            <div className="card-body d-flex justify-content-center">
              Login
            </div>
          </div>
        </div>
      </div>
    )
  }
}