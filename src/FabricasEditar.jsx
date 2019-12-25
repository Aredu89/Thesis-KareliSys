import React from 'react'
import Swal from 'sweetalert2' //https://github.com/sweetalert2/sweetalert2

export default class FabricasEditar extends React.Component {
  constructor() {
    super()
    this.state = {
      nuevo: true,
      cargando: true,
      error: "",
      _id: "",
      // Campos del formulario
      nombre: "",
      direccion: "",
      ciudad: "",
      telefono: "",
      contactos: [],
      pedidos: [],
      creada: new Date(),
      errorNombre: false
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.obtenerFabrica = this.obtenerFabrica.bind(this)
  }

  componentDidMount(){
    if(this.props.params.id){
      this.obtenerFabrica()
    } else {
      this.setState({
        cargando: false
      })
    }
  }

  obtenerFabrica(){
    fetch(`/api/fabricas/${this.props.params.id}`)
      .then(res =>{
        if(res.ok){
          res.json()
          .then(data =>{
            console.log("Fabrica: ",data)
            this.setState({
              _id: data._id,
              nuevo: false,
              cargando: false,
              nombre:data.nombre,
              direccion: data.direccion,
              ciudad: data.ciudad,
              telefono: data.telefono,
              contactos: data.contactos,
              pedidos: data.pedidos,
              creada: data.creada
            })
          })
        } else {
          res.json()
          .then(error => {
            console.log("Error al obtener fabrica - ",error.message)
            this.setState({
              cargando: false,
              error: error.message
            })
          })
        }
      })
      .catch(error => {
        console.log("Error en el fetch. ",error.message)
        this.setState({
          cargando: false,
          error: error.message
        })
      })
  }

  //Manejo de cambios en el formulario
  handleOnChange(event){
    this.setState({
      [event.target.name]: event.target.value
    })
    //Quito el error del campo obligatorio
    if(event.target.name === "nombre"){
      this.setState({
        errorNombre: false
      })
    }
  }

  //Función para crear una nueva fábrica
  crearFabrica(nuevaFabrica) {
    fetch('/api/fabricas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaFabrica),
    })
      .then(res => {
        if(res.ok) {
          res.json()
            .then(data => {
              console.log("Fabrica creada: ",data)
              Swal.fire(
                "Fabrica creada!",
                "",
                "success"
              ).then(()=>{
                this.props.history.push("/fabricas")
              })
            })
        } else {
          res.json()
          .then(err => {
            console.log("Error al crear fabrica: ",err.message)
            Swal.fire(
              "Error al crear la fábrica",
              "",
              "error"
            )
          })
        }
      })
      .catch(err => {
        console.log("Error al crear: ",err.message)
        Swal.fire(
          "Error del servidor",
          "",
          "error"
        )
      })
  }

  onClickGuardar(){
    if(this.state.nombre){
      if(this.state.nuevo){
        //Creo un registro
        this.crearFabrica({
          nombre: this.state.nombre,
          direccion: this.state.direccion,
          ciudad: this.state.ciudad,
          telefono: this.state.telefono,
          contactos: this.state.contactos,
          pedidos: this.state.pedidos,
          creada: this.state.creada
        })
      }
    } else {
      this.setState({
        errorNombre: true
      })
    }
  }

  render() {
    return (
      <div className="fabricas-editar text-center">
        {!this.state.cargando ?
        <div>
          <div className="row">
            <div className="col-12 d-flex justify-content-between">
              {/* Titulo */}
              {
                this.state.nuevo ?
                  <h3>Crear Fabrica</h3>
                :
                  <h3>Modificar Fábrica: {this.state.nombre}</h3>
              }
              {/* Boton para guardar cambios */}
              <button type="button" 
                className="btn btn-success"
                onClick={() => this.onClickGuardar()}
                >+ Guardar</button>
            </div>
          </div>
          {/* Formulario */}
          <div className="row contenedor-formulario text-center">
            {/* Nombre */}
            <div className="col-sm-6 col-12 form-group">
              <label>Nombre</label>
              <input type="text" 
                className={this.state.errorNombre ? "form-control is-invalid" : "form-control"}
                id="nombre" 
                name="nombre"
                placeholder="Nombre..."
                value={this.state.nombre}
                onChange={this.handleOnChange} />
              {
                this.state.errorNombre ?
                <div className="invalid-feedback">El nombre es requerido</div>
                : null
              }
            </div>
            {/* Direccion */}
            <div className="col-sm-6 col-12 form-group">
              <label>Dirección</label>
              <input type="text" 
                className="form-control"
                id="direccion" 
                name="direccion"
                placeholder="Dirección..."
                value={this.state.direccion}
                onChange={this.handleOnChange} />
            </div>
            {/* Ciudad */}
            <div className="col-sm-6 col-12 form-group">
              <label>Ciudad</label>
              <input type="text" 
                className="form-control"
                id="ciudad" 
                name="ciudad"
                placeholder="Ciudad..."
                value={this.state.ciudad}
                onChange={this.handleOnChange} />
            </div>
            {/* Teléfono */}
            <div className="col-sm-6 col-12 form-group">
              <label>Teléfono</label>
              <input type="number" 
                className="form-control"
                id="telefono" 
                name="telefono"
                placeholder="Teléfono..."
                value={this.state.telefono}
                onChange={this.handleOnChange} />
            </div>
          </div>
        </div>
        :
        this.state.error ?
          //Mensaje de error
          <div className="alert alert-dismissible alert-danger">
            <button type="button" className="close" data-dismiss="alert">&times;</button>
            <strong>Error!</strong> {this.state.error}
          </div>
        :
          // Spinner
          <div className="spinner-border text-light" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        }
      </div>
    )
  }
}