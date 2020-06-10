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
      producto: "",
      tipo: "",
      material: "",
      talle: "",
      estilo: "",
      cantidad: "",
      estante: "",
      errorProducto: false,
      //Permisos
      permits: ""
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.obtenerStock = this.obtenerStock.bind(this)
  }

  componentDidMount(){
    if(this.props.params.id){
      this.obtenerStock()
    } else {
      this.setState({
        cargando: false
      })
    }
    //Controlo permisos
    const user = JSON.parse(localStorage.getItem("currentUser"))
    if(user){
      if(user.permits){
        this.setState({
          permits: user.permits.stock ? user.permits.stock : ""
        })
      }
    }
  }

  obtenerStock(){
    fetch(`/api/stock/${this.props.params.id}`)
      .then(res =>{
        if(res.ok){
          res.json()
          .then(data =>{
            console.log("Stock: ",data)
            this.setState({
              _id: data._id,
              nuevo: false,
              cargando: false,
              producto: data.producto,
              tipo: data.tipo,
              material: data.material,
              talle: data.talle,
              estilo: data.estilo,
              cantidad: data.cantidad,
              estante: data.estante,
            })
          })
        } else {
          res.json()
          .then(error => {
            console.log("Error al obtener stock - ",error.message)
            this.setState({
              cargando: false,
              error: error.message
            })
          })
        }
      })
      .catch(error => {
        console.log("Error del servidor. ",error.message)
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
    if(event.target.name === "producto"){
      this.setState({
        errorProducto: false
      })
    }
  }

  //Función para crear un nuevo stock
  crearStock(nuevoStock) {
    fetch('/api/stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoStock),
    })
      .then(res => {
        if(res.ok) {
          res.json()
            .then(data => {
              console.log("Stock creado: ",data)
              Swal.fire(
                "Stock creado!",
                "",
                "success"
              ).then(()=>{
                this.props.history.push("/stock")
              })
            })
        } else {
          res.json()
          .then(err => {
            console.log("Error al crear stock: ",err.message)
            Swal.fire(
              "Error al crear el stock",
              "",
              "error"
            )
          })
        }
      })
      .catch(err => {
        console.log("Error del servidor: ",err.message)
        Swal.fire(
          "Error del servidor",
          "",
          "error"
        )
      })
  }

  //Función para modificar un stock
  modificarStock(nuevoStock, id){
    fetch(`/api/stock/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoStock),
    })
      .then(res => {
        if(res.ok) {
          res.json()
            .then(data => {
              console.log("Stock modificado: ",data)
              Swal.fire(
                "Stock modificado!",
                "",
                "success"
              ).then(()=>{
                this.props.history.push("/stock")
              })
            })
        } else {
          res.json()
          .then(err => {
            console.log("Error al modificar stock: ",err.message)
            Swal.fire(
              "Error al modificar el stock",
              "",
              "error"
            )
          })
        }
      })
      .catch(err => {
        console.log("Error del servidor: ",err.message)
        Swal.fire(
          "Error del servidor",
          "",
          "error"
        )
      })
  }

  onClickGuardar(){
    if(this.state.producto){
      if(this.state.nuevo){
        //Creo un registro
        this.crearStock({
          producto: this.state.producto,
          tipo: this.state.tipo,
          material: this.state.material,
          talle: this.state.talle,
          estilo: this.state.estilo,
          cantidad: this.state.cantidad,
          estante: this.state.estante
        })
      } else {
        //Modifico un registro
        this.modificarStock({
          _id: this.state._id,
          producto: this.state.producto,
          tipo: this.state.tipo,
          material: this.state.material,
          talle: this.state.talle,
          estilo: this.state.estilo,
          cantidad: this.state.cantidad,
          estante: this.state.estante
        }, this.state._id)
      }
    } else {
      this.setState({
        errorProducto: true
      })
    }
  }

  render() {
    const {
      permits
    } = this.state
    //Permisos
    const permitUpdate = permits === "MODIFICAR" ? true : false
    const permitCreate = permits === "MODIFICAR" ||
      permits === "CREAR" ? true : false
    const permitRead = permits === "MODIFICAR" ||
      permits === "CREAR" ||
      permits === "LEER" ? true : false
    return (
      <div className="fabricas-editar text-center">
        {!this.state.cargando ?
        <div>
          <div className="row">
            <div className="col-12 d-flex justify-content-between">
              {/* Titulo */}
              {
                this.state.nuevo ?
                  <h3>Crear Stock</h3>
                :
                  <h3>Modificar Stock: {this.state.producto}</h3>
              }
              {/* Boton para guardar cambios */}
              {
                (
                  this.state.nuevo && permitCreate ||
                  !this.state.nuevo && permitUpdate
                ) &&
                <button type="button" 
                  className="btn btn-success"
                  onClick={() => this.onClickGuardar()}
                  >+ Guardar</button>
              }
            </div>
          </div>
          {/* Formulario */}
          <div className="row contenedor-formulario text-center">
            {/* Producto */}
            <div className="col-sm-6 col-12 form-group">
              <label>Producto</label>
              <input type="text" 
                className={this.state.errorProducto ? "form-control is-invalid" : "form-control"}
                id="producto" 
                name="producto"
                placeholder="Producto..."
                value={this.state.producto}
                onChange={this.handleOnChange}
                disabled={this.state.nuevo && permitCreate ||
                  !this.state.nuevo && permitUpdate ? false : true} />
              {
                this.state.errorProducto ?
                <div className="invalid-feedback">El producto es requerido</div>
                : null
              }
            </div>
            {/* Tipo */}
            <div className="col-sm-6 col-12 form-group">
              <label>Tipo</label>
              <input type="text" 
                className="form-control"
                id="tipo" 
                name="tipo"
                placeholder="Tipo..."
                value={this.state.tipo}
                onChange={this.handleOnChange}
                disabled={this.state.nuevo && permitCreate ||
                  !this.state.nuevo && permitUpdate ? false : true} />
            </div>
            {/* Material */}
            <div className="col-sm-6 col-12 form-group">
              <label>Material</label>
              <input type="text" 
                className="form-control"
                id="material" 
                name="material"
                placeholder="Material..."
                value={this.state.material}
                onChange={this.handleOnChange}
                disabled={this.state.nuevo && permitCreate ||
                  !this.state.nuevo && permitUpdate ? false : true} />
            </div>
            {/* Talle */}
            <div className="col-sm-6 col-12 form-group">
              <label>Talle</label>
              <input type="number" 
                className="form-control"
                id="talle" 
                name="talle"
                placeholder="Talle..."
                value={this.state.talle}
                onChange={this.handleOnChange}
                disabled={this.state.nuevo && permitCreate ||
                  !this.state.nuevo && permitUpdate ? false : true} />
            </div>
            {/* Estilo */}
            <div className="col-sm-6 col-12 form-group">
              <label>Estilo</label>
              <input type="text" 
                className="form-control"
                id="estilo" 
                name="estilo"
                placeholder="Estilo..."
                value={this.state.estilo}
                onChange={this.handleOnChange}
                disabled={this.state.nuevo && permitCreate ||
                  !this.state.nuevo && permitUpdate ? false : true} />
            </div>
            {/* Cantidad */}
            <div className="col-sm-6 col-12 form-group">
              <label>Cantidad</label>
              <input type="number" 
                className="form-control"
                id="cantidad" 
                name="cantidad"
                placeholder="Cantidad..."
                value={this.state.cantidad}
                onChange={this.handleOnChange}
                disabled={this.state.nuevo && permitCreate ||
                  !this.state.nuevo && permitUpdate ? false : true} />
            </div>
            {/* Estante */}
            <div className="col-sm-6 col-12 form-group">
              <label>Estante</label>
              <input type="text" 
                className="form-control"
                id="estante" 
                name="estante"
                placeholder="Estante..."
                value={this.state.estante}
                onChange={this.handleOnChange}
                disabled={this.state.nuevo && permitCreate ||
                  !this.state.nuevo && permitUpdate ? false : true} />
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