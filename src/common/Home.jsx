import React from'react'
import funciones from './javascriptFunctions.js'

export default class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      ingresos: 0,
      cargandoIngresos: true,
      errorIngresos: "",
      egresos: 0,
      cargandoEgresos: true,
      errorEgresos: "",
      stock: 0,
      cargandoStock: true,
      errorStock: ""
    }
    this.cargarEgresos = this.cargarEgresos.bind(this)
    this.cargarIngresos = this.cargarIngresos.bind(this)
    this.cargarStockCantidad = this.cargarStockCantidad.bind(this)
  }

  componentDidMount(){
    this.cargarEgresos()
    this.cargarIngresos()
    this.cargarStockCantidad()
  }

  cargarEgresos(){
    //Calculo el primer y ultimo día del mes
    const ahora = new Date()
    const año = ahora.getFullYear()
    const mes = ahora.getMonth()
    const mesSiguiente = mes === 11 ? 0 : mes + 1
    const desde = new Date(año, mes, 1)
    const hasta = new Date(año, mesSiguiente, 1)
    fetch(`/api/egresos?desde=${funciones.fechaANumeros(desde)}&hasta=${funciones.fechaANumeros(hasta)}`)
      .then(res => {
        if(res.ok) {
          res.json()
          .then(data=>{
            this.setState({
              cargandoEgresos: false,
              errorEgresos: "",
              egresos: data.egresosMes
            })
          })
        } else {
          res.json()
          .then(error => {
            console.log("Error al obtener egresos. ", error.message)
            this.setState({
              cargandoEgresos: false,
              errorEgresos: error.message
            })
          })
        }
      })
      .catch(error => {
        console.log("Error: ",error.message)
        this.setState({
          cargandoEgresos: false,
          errorEgresos: error.message
        })
      })
  }

  cargarIngresos(){
    //Calculo el primer y ultimo día del mes
    const ahora = new Date()
    const año = ahora.getFullYear()
    const mes = ahora.getMonth()
    const mesSiguiente = mes === 11 ? 0 : mes + 1
    const desde = new Date(año, mes, 1)
    const hasta = new Date(año, mesSiguiente, 1)
    fetch(`/api/ingresos?desde=${funciones.fechaANumeros(desde)}&hasta=${funciones.fechaANumeros(hasta)}`)
      .then(res => {
        if(res.ok) {
          res.json()
          .then(data=>{
            this.setState({
              cargandoIngresos: false,
              errorIngresos: "",
              ingresos: data.ingresosMes
            })
          })
        } else {
          res.json()
          .then(error => {
            console.log("Error al obtener ingresos. ", error.message)
            this.setState({
              cargandoIngresos: false,
              errorIngresos: error.message
            })
          })
        }
      })
      .catch(error => {
        console.log("Error: ",error.message)
        this.setState({
          cargandoIngresos: false,
          errorIngresos: error.message
        })
      })
  }

  cargarStockCantidad(){
    fetch('/api/stock-cantidad')
      .then(res => {
        if(res.ok) {
          res.json()
          .then(data=>{
            this.setState({
              cargandoStock: false,
              errorStock: "",
              stock: data.cantidadStock
            })
          })
        } else {
          res.json()
          .then(error => {
            console.log("Error al obtener stock. ", error.message)
            this.setState({
              cargandoStock: false,
              errorStock: error.message
            })
          })
        }
      })
      .catch(error => {
        console.log("Error: ",error.message)
        this.setState({
          cargandoStock: false,
          errorStock: error.message
        })
      })
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
                {
                  this.state.cargandoIngresos || this.state.cargandoEgresos ?
                    // Spinner
                    <div className="spinner-border text-light" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  :
                    this.state.errorEgresos || this.state.errorIngresos ?
                      <h4 className="card-title">Error al cargar los resultados del mes</h4>
                    :
                      <div>
                        {
                          this.state.ingresos - this.state.egresos < 0 ?
                            <h4 className="card-title">Perdidas de:</h4>
                          :
                            <h4 className="card-title">Ganancias de:</h4>
                        }
                        <p className="card-text">{funciones.moneyFormatter(this.state.ingresos - this.state.egresos)}</p>
                      </div>
                }
                
              </div>
            </div>
          </div>
          {/* Card Stock */}
          <div className="col-md-6 col-12">
            <div className="col-12 card border-primary mb-3">
              <div className="card-header">Estado del Stock</div>
              <div className="card-body">
                {
                  this.state.cargandoStock ?
                    // Spinner
                    <div className="spinner-border text-light" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  :
                    this.state.errorStock ?
                      <p className="card-text">Error al cargar el stock</p>
                    :
                      <p className="card-text">Productos en stock: <strong>{this.state.stock}</strong></p>
                }
              </div>
            </div>
          </div>
          {/* Card Ingresos */}
          <div className="col-md-6 col-12">
            <div className="col-12 card border-success mb-3">
              <div className="card-header">Ingresos del mes</div>
              <div className="card-body">
                {
                  this.state.cargandoIngresos ?
                    // Spinner
                    <div className="spinner-border text-light" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  :
                    this.state.errorIngresos ?
                      <h4 className="card-title">Error al cargar los ingresos</h4>
                    :
                      <div>
                        <h4 className="card-title">Total Cobrado:</h4>
                        <p className="card-text">{this.state.ingresos}</p>
                      </div>
                }
              </div>
            </div>
          </div>
          {/* Card Egresos */}
          <div className="col-md-6 col-12">
            <div className="col-12 card border-danger mb-3">
              <div className="card-header">Egresos del mes</div>
              <div className="card-body">
                {
                  this.state.cargandoEgresos ?
                    // Spinner
                    <div className="spinner-border text-light" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  :
                    this.state.errorEgresos ?
                      <h4 className="card-title">Error al cargar los ingresos</h4>
                    :
                      <div>
                        <h4 className="card-title">Total Pagado:</h4>
                        <p className="card-text">{this.state.egresos}</p>
                      </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}