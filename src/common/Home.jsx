import React from'react'
import funciones from './javascriptFunctions.js'

export default class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      cargando: true,
      error: "",
      ingresos: 0,
      egresos: 0,
      stock: 0,
      stockPendiente: 0
    }
  }

  render() {
    return (
      <div className="home">
        <div className="row">
          {/* Card Resultado */}
          <div className="col-md-6 col-12">
            <div className="col-12 card border-primary mb-3">
              <div className="card-header">Resultado del mes</div>
              <div className="card-body">
                <h4 className="card-title">Ganancias de:</h4>
                <p className="card-text">$40.000</p>
              </div>
            </div>
          </div>
          {/* Card Stock */}
          <div className="col-md-6 col-12">
            <div className="col-12 card border-primary mb-3">
              <div className="card-header">Movimientos de stock del mes</div>
              <div className="card-body">
                <p className="card-text">Productos que ingresaron: 200</p>
                <p className="card-text">Productos que egresaron: 160</p>
              </div>
            </div>
          </div>
          {/* Card Ingresos */}
          <div className="col-md-6 col-12">
            <div className="col-12 card border-success mb-3">
              <div className="card-header">Ingresos del mes</div>
              <div className="card-body">
                <h4 className="card-title">Total Cobrado:</h4>
                <p className="card-text">$140.000</p>
              </div>
            </div>
          </div>
          {/* Card Egresos */}
          <div className="col-md-6 col-12">
            <div className="col-12 card border-danger mb-3">
              <div className="card-header">Egresos del mes</div>
              <div className="card-body">
                <h4 className="card-title">Total Pagado:</h4>
                <p className="card-text">$100.000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}