import React from 'react'

export default class ContactosEditar extends React.Component {
  constructor() {
    super()
    this.state = {
      _id: "",
      nombre: "",
      errorNombre: false,
      talleNuevo: 0,
      errorTalleNuevo: false,
      talles: [],
      errorTalles: false,
      errorTalleRepetido: false,
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.agregarTalle = this.agregarTalle.bind(this)
  }

  componentDidMount(){
    if(this.props.data){
      this.setState({
        _id: this.props.data._id,
        nombre: this.props.data.nombre,
        talles: this.props.data.talles,
        errorTalles: false,
        errorTalleRepetido: false,
      })
    }
  }

  handleOnChange(event){
    this.setState({
      [event.target.name]: event.target.value
    })
    //Limpio el error del nombre
    if(event.target.name === "nombre" && this.state.errorNombre == true){
      this.setState({
        errorNombre: false
      })
    }
  }

  agregarTalle(){
    let talles = this.state.talles
    //controlar que el nombre tenga un valor
    if(this.state.talleNuevo > 0){
      let value = null
      this.setState({
        errorTalleNuevo: false
      })
      value = talles.find(talle=>talle === this.state.talleNuevo)
      if(value){
        this.setState({
          errorTalleRepetido: true
        })
      } else {
        talles.push(this.state.talleNuevo)
        this.setState({
          talles: talles,
          errorTalleRepetido: false,
          errorTalles: false
        })
      }
    } else {
      this.setState({
        errorTalleNuevo: true
      })
    }
  }

  eliminarTalle(i){
    let talles = this.state.talles
    talles.splice(i,1)
    this.setState({
      talles
    })
  }

  onSave(){
    if(
      this.state.nombre &&
      this.state.talles.length > 0
    ){
      this.props.onSave({
        _id: this.state._id,
        nombre: this.state.nombre,
        talles: this.state.talles,
        errorTalles: false,
        errorNombre: false,
      }, "productos")
      this.props.onClose()
    } else {
      if(!this.state.nombre){
        this.setState({
          errorNombre: true
        })
      }
      if(this.state.talles.length < 1){
        this.setState({
          errorTalles: true
        })
      }
    }
  }

  render(){
    return(
      <div className="productos-editar">
        {/* Header */}
        <div className="header d-flex justify-content-between align-items-center">
          <span>{this.props.titulo}</span>
          <button
            type="button"
            className="modal-cerrar d-flex align-items-center"
            onClick={()=>this.props.onClose()}
            >
              <i className="material-icons">clear</i>
            </button>
        </div>
        {/* Formulario */}
        <div className="formulario pt-2">
          {/* Nombre */}
          <div className="col-12 form-group text-center pt-2">
            <label>Nombre</label>
            <input
              className={this.state.errorNombre ? "form-control is-invalid" : "form-control"}
              id="nombre" 
              name="nombre"
              placeholder="Nombre..."
              value={this.state.nombre}
              onChange={this.handleOnChange} 
              />
            {
              this.state.errorNombre &&
              <div className="invalid-feedback">Se debe ingresar un nombre</div>
            }
          </div>
          {/* Talles */}
          <div className="col-12 form-group text-center pt-2">
            <label>Agregar talles disponibles</label>
            <div className="contenedor-productos">
              <div className="d-flex justify-content-between">
                <div className="text-center">
                  <label>Talle</label>
                  <input type="number" 
                    className="form-control"
                    id="talleNuevo" 
                    name="talleNuevo"
                    placeholder="Talle..."
                    value={this.state.talleNuevo}
                    onChange={this.handleOnChange} 
                    />
                </div>
                <div className="text-center d-flex align-items-end">
                  <button 
                    type="button"
                    className="btn btn-outline-success"
                    onClick={()=>this.agregarTalle()}
                    >+</button>
                </div>
              </div>
            </div>
          </div>
          {/* Talles agregados */}
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Talle</th>
                <th scope="col">Quitar</th>
              </tr>
            </thead>
            <tbody>
            {
              this.state.talles.map((talle, i)=>{
                return <tr className="table-default" key={i}>
                  <td>{talle}</td>
                  <td>
                    <button 
                      type="button"
                      className="btn btn-outline-success"
                      onClick={()=>this.eliminarTalle(i)}
                      >X</button>
                  </td>
                </tr>
              })
            }
            </tbody>
          </table>
          {/* Errores */}
          {this.state.errorTalleNuevo ?
            <div className="col-12 form-group text-center pt-2">
              <div className="alert alert-dismissible alert-danger">
                <button type="button" className="close" data-dismiss="alert">&times;</button>
                <strong>Error!</strong> El talle debe ser mayor a cero
              </div>
            </div>
          : null}
          {this.state.errorTalleRepetido ?
            <div className="col-12 form-group text-center pt-2">
              <div className="alert alert-dismissible alert-danger">
                <button type="button" className="close" data-dismiss="alert">&times;</button>
                <strong>Error!</strong> Ya se agregó ese talle
              </div>
            </div>
          : null}
          {this.state.errorTalles ?
            <div className="col-12 form-group text-center pt-2">
              <div className="alert alert-dismissible alert-danger">
                <button type="button" className="close" data-dismiss="alert">&times;</button>
                <strong>Error!</strong> Debe haber talles disponibles
              </div>
            </div>
          : null}
          {/* Boton de guardar */}
          <div className="col-12 form-group text-center pt-2 boton-guardar">
            <button 
              type="button"
              className="btn btn-success"
              onClick={()=>this.onSave()}
              >Guardar</button>
          </div>
        </div>
      </div>
    )
  }
}