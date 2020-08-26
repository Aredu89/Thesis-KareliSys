import React from 'react'
import Swal from 'sweetalert2' //https://github.com/sweetalert2/sweetalert2
import FormSelect from '../common/FormSelect.jsx'

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
      errorProducto: false,
      fabrica: "",
      errorFabrica: false,
      tipo: "",
      material: "",
      talle: "",
      errorTalle: false,
      estilo: "",
      cantidad: "",
      errorCantidad: false,
      estante: "",
      fabricas: [],
      //Permisos
      permits: ""
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.obtenerStock = this.obtenerStock.bind(this)
    this.obtenerFabricas = this.obtenerFabricas.bind(this)
  }

  componentDidMount(){
    if(this.props.params.id){
      this.obtenerStock()
    } else {
      this.setState({
        cargando: false
      })
    }
    //Obtengo las fabricas
    this.obtenerFabricas()
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

  obtenerFabricas(){
    fetch(`/api/fabricas`)
      .then(res =>{
        if(res.ok){
          res.json()
          .then(data =>{
            console.log("fabricas: ",data)
            this.setState({
              fabricas: data
            })
          })
        } else {
          res.json()
          .then(error => {
            console.log("Error al obtener fabricas ",error.message)
            this.setState({
              cargando: false,
              error: error.message
            })
          })
        }
      })
      .catch(error => {
        console.log("Error en el servidor. ",error.message)
        this.setState({
          cargando: false,
          error: error.message
        })
      })
  }

  obtenerStock(){
    fetch(`/api/stock/${this.props.params.id}`)
      .then(res =>{
        if(res.ok){
          res.json()
          .then(data =>{
            this.setState({
              _id: data._id,
              nuevo: false,
              cargando: false,
              producto: data.producto,
              fabrica: data.fabrica,
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
    if(event.target.name === "fabrica"){
      this.setState({
        errorFabrica: false
      })
    }
    if(event.target.name === "talle"){
      this.setState({
        errorTalle: false
      })
    }
    if(event.target.name === "cantidad"){
      this.setState({
        errorCantidad: false
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
    if(
      this.state.producto &&
      this.state.fabrica &&
      this.state.talle &&
      this.state.cantidad
      ){
      if(this.state.nuevo){
        //Creo un registro
        this.crearStock({
          producto: this.state.producto,
          fabrica: this.state.fabrica,
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
          fabrica: this.state.fabrica,
          tipo: this.state.tipo,
          material: this.state.material,
          talle: this.state.talle,
          estilo: this.state.estilo,
          cantidad: this.state.cantidad,
          estante: this.state.estante
        }, this.state._id)
      }
    } else {
      if(!this.state.fabrica){
        this.setState({
          errorFabrica: true
        })
      }
      if(!this.state.producto){
        this.setState({
          errorProducto: true
        })
      }
      if(!this.state.talle){
        this.setState({
          errorTalle: true
        })
      }
      if(!this.state.cantidad){
        this.setState({
          errorCantidad: true
        })
      }
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
    //Opciones de los selects
    let fabricasArray = []
    let productosArray = []
    let tallesArray = []
    if(this.state.fabricas){
      if(this.state.fabricas.length > 0){
        //Completo las opciones de fábricas
        this.state.fabricas.forEach(fab=>{
          fabricasArray.push({
            id: fab.nombre,
            value: fab.nombre
          })
        })
        //Completo las opciones de productos
        if(this.state.fabrica){
          const fabricaAux = this.state.fabricas.find(fabr=>fabr.nombre === this.state.fabrica)
          if(fabricaAux){
            if(fabricaAux.productos){
              if(fabricaAux.productos.length > 0){
                fabricaAux.productos.forEach(prod=>{
                  productosArray.push({
                    id: prod.nombre,
                    value: prod.nombre
                  })
                })
                //Completo las opciones de talles
                if(this.state.producto){
                  const productoAux = fabricaAux.productos.find(pr=>pr.nombre === this.state.producto)
                  if(productoAux){
                    if(productoAux.talles){
                      if(productoAux.talles.length > 0){
                        productoAux.talles.forEach(tall=>{
                          tallesArray.push({
                            id: tall,
                            value: tall
                          })
                        })
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
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
            {/* Fabrica */}
            <div className="col-sm-6 col-12 form-group">
              <FormSelect
                label="Fábrica"
                name="fabrica"
                value={this.state.fabrica}
                onChange={this.handleOnChange}
                error={this.state.errorFabrica}
                options={fabricasArray}
                disabled={this.state.nuevo && permitCreate ||
                  !this.state.nuevo && permitUpdate ? false : true}
                />
            </div>
            {/* Producto */}
            <div className="col-sm-6 col-12 form-group">
              <FormSelect
                label="Producto"
                name="producto"
                value={this.state.producto}
                onChange={this.handleOnChange}
                error={this.state.errorProducto}
                options={productosArray}
                disabled={this.state.nuevo && permitCreate ||
                  !this.state.nuevo && permitUpdate ? false : true}
                />
            </div>
            {/* Talle */}
            <div className="col-sm-6 col-12 form-group">
              <FormSelect
                label="Talle"
                name="talle"
                value={this.state.talle}
                onChange={this.handleOnChange}
                error={this.state.errorTalle}
                options={tallesArray}
                disabled={this.state.nuevo && permitCreate ||
                  !this.state.nuevo && permitUpdate ? false : true}
                />
            </div>
            {/* Cantidad */}
            <div className="col-sm-6 col-12 form-group">
              <label>Cantidad</label>
              <input type="number" 
                className={this.state.errorCantidad ? "form-control is-invalid" : "form-control"}
                id="cantidad" 
                name="cantidad"
                placeholder="Cantidad..."
                value={this.state.cantidad}
                onChange={this.handleOnChange}
                disabled={this.state.nuevo && permitCreate ||
                  !this.state.nuevo && permitUpdate ? false : true} />
              {
                this.state.errorCantidad ?
                <div className="invalid-feedback">Ingrese una cantidad</div>
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