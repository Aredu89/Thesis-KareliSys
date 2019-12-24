import React from 'react'

export default class FabricasEditar extends React.Component {
  constructor() {
    super()
    this.state = {
      fabrica: {},
      nuevo: true,
      error: ""
    }
  }

  componentDidMount(){
    if(this.props.params.id){
      this.obtenerFabrica()
    }
  }

  obtenerFabrica(){
    null
  }

  render() {
    const nuevo = this.props.params.id ? true : false
    return (
      <div className="fabricas-editar">
        <div className="row">
          <div className="col-12 d-flex justify-content-between">

          </div>
        </div>
      </div>
    )
  }
}