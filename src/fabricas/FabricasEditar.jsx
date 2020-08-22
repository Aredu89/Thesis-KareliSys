import React from 'react'
import Swal from 'sweetalert2' //https://github.com/sweetalert2/sweetalert2
import TablaFlexible from '../common/TablaFlexible.jsx'
import Modal from 'react-responsive-modal'
import ContactosEditar from './ContactosEditar.jsx'
import PedidosEditar from './PedidosEditar.jsx'
import ProductosEditar from './ProductosEditar.jsx'

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
      productos: [],
      pedidos: [],
      creada: new Date(),
      errorNombre: false,
      modalContactos: false,
      modalContactosEditar: null,
      modalPedidos: false,
      modalPedidosEditar: null,
      modalProductos: false,
      modalProductosEditar: null,
      //Permisos
      permits: ""
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.obtenerFabrica = this.obtenerFabrica.bind(this)
    this.onOpenModal = this.onOpenModal.bind(this)
    this.onCloseModal = this.onCloseModal.bind(this)
    this.handleEditarContacto = this.handleEditarContacto.bind(this)
    this.onSaveModal = this.onSaveModal.bind(this)
    this.handleEliminarContacto = this.handleEliminarContacto.bind(this)
    this.handleEditarProducto = this.handleEditarProducto.bind(this)
    this.handleEliminarProducto = this.handleEliminarProducto.bind(this)
    this.handleEditarPedido = this.handleEditarPedido.bind(this)
    this.handleEliminarPedido = this.handleEliminarPedido.bind(this)
    this.onCrearPedido = this.onCrearPedido.bind(this)
  }

  componentDidMount(){
    if(this.props.params.id){
      this.obtenerFabrica()
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
          permits: user.permits.fabricas ? user.permits.fabricas : ""
        })
      }
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
              productos: data.productos,
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

  //Función para modificar una fábrica
  modificarFabrica(nuevaFabrica, id){
    fetch(`/api/fabricas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaFabrica),
    })
      .then(res => {
        if(res.ok) {
          res.json()
            .then(data => {
              console.log("Fabrica modificada: ",data)
              Swal.fire(
                "Fabrica modificada!",
                "",
                "success"
              ).then(()=>{
                this.props.history.push("/fabricas")
              })
            })
        } else {
          res.json()
          .then(err => {
            console.log("Error al modificar fabrica: ",err.message)
            Swal.fire(
              "Error al modificar la fábrica",
              "",
              "error"
            )
          })
        }
      })
      .catch(err => {
        console.log("Error al modificar: ",err.message)
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
          productos: this.state.productos,
          creada: this.state.creada
        })
      } else {
        //Modifico un registro
        this.modificarFabrica({
          nombre: this.state.nombre,
          direccion: this.state.direccion,
          ciudad: this.state.ciudad,
          telefono: this.state.telefono,
          contactos: this.state.contactos,
          productos: this.state.productos,
          creada: this.state.creada
        }, this.state._id)
      }
    } else {
      this.setState({
        errorNombre: true
      })
    }
  }

  handleEditarContacto(id){
    //Busco el id
    this.state.contactos.forEach(contacto => {
      if(contacto._id === id){
        this.setState({
          modalContactosEditar: contacto
        }, this.onOpenModal("modalContactos"))
        return
      }
    })
  }
  
  handleEliminarContacto(id){
    let auxContactos = this.state.contactos
    //Elimino el contacto del state
    auxContactos.forEach((contacto, i) => {
      if(contacto._id === id){
        auxContactos.splice(i,1)
        this.setState({
          contactos: auxContactos
        })
        return
      }
    })
  }

  handleEditarProducto(id){
    //Busco el id
    this.state.productos.forEach(producto => {
      if(producto._id === id){
        this.setState({
          modalProductosEditar: producto
        }, this.onOpenModal("modalProductos"))
        return
      }
    })
  }
  
  handleEliminarProducto(id){
    let auxProductos = this.state.productos
    //Elimino el contacto del state
    auxProductos.forEach((producto, i) => {
      if(producto._id === id){
        auxProductos.splice(i,1)
        this.setState({
          productos: auxProductos
        })
        return
      }
    })
  }

  handleEditarPedido(id){
    //Busco el id
    this.state.pedidos.forEach(pedido => {
      if(pedido._id === id){
        this.setState({
          modalPedidosEditar: pedido
        }, this.onOpenModal("modalPedidos"))
        return
      }
    })
  }
  
  handleEliminarPedido(id){
    //Primero pido confirmación
    Swal.fire({
      title: "¿Seguro que desea eliminar?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar"
    }).then((result)=>{
      if(result.value){
        //Elimino
        fetch(`/api/fabricas/${this.state._id}/pedidos/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(res => {
            if(res.ok){
              res.json()
                .then(data=>{
                  Swal.fire(
                    "Pedido Eliminado",
                    "",
                    "success"
                  ).then(()=>{
                    this.setState({
                      pedidos: data.pedidos
                    })
                  })
                })
            } else {
                Swal.fire(
                  "Error al eliminar",
                  "",
                  "error"
                )
            }
          })
          .catch(err=> {
            Swal.fire(
              "Error del servidor",
              err.message,
              "error"
            )
          })
      }
    })
  }

  goToPagos(){
    this.props.history.push(`/fabricas/pagos/${this.props.params.id}`)
  }

  //Modal
  onOpenModal(cual){
    this.setState({
      [cual]: true
    })
  }
  onCloseModal(cual){
    this.setState({
      [cual]: false,
      [cual+"Editar"]: null
    })
  }
  onSaveModal(obj, array){
    let auxArray = this.state[array]
    if(!obj._id){
      //Inserto un nuevo registro
      auxArray.push(obj)
    } else {
      //reemplazo el registro
      auxArray.forEach((elemento, i)=>{
        if(obj._id === elemento._id){
          auxArray.splice(i,1,obj)
        }
      })
    }
    this.setState({
      [array]: auxArray
    })
  }

  onCrearPedido(obj){
    if(obj._id){
      //Modifico un pedido existente
      fetch(`/api/fabricas/${this.state._id}/pedidos/${obj._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
      })
        .then(res => {
          if(res.ok) {
            res.json()
              .then(data => {
                Swal.fire(
                  "Pedido modificado!",
                  "",
                  "success"
                ).then(()=>{
                  this.setState({
                    pedidos: data.pedidos
                  })
                })
              })
          } else {
            res.json()
            .then(err => {
              console.log("Error al modificar pedido: ",err.message)
              Swal.fire(
                "Error al modificar el pedido",
                err.message,
                "error"
              )
            })
          }
        })
        .catch(err => {
          console.log("Error al crear: ",err.message)
          Swal.fire(
            "Error del servidor",
            err.message,
            "error"
          )
        })
    } else {
      //Crear pedido
      fetch(`/api/fabricas/${this.state._id}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
      })
        .then(res => {
          if(res.ok) {
            res.json()
              .then(data => {
                Swal.fire(
                  "Pedido creado!",
                  "",
                  "success"
                ).then(()=>{
                  this.setState({
                    pedidos: data.pedidos
                  })
                })
              })
          } else {
            res.json()
            .then(err => {
              console.log("Error al crear pedido: ",err.message)
              Swal.fire(
                "Error al crear el pedido",
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
    //Tabla
    const columnsContactos = [
      ["Nombre","nombre","String"],
      ["Apellido","apellido","String"],
      ["Email","email","String"],
      ["Teléfono","telefono","String"]
    ]
    const columnsPedidos = [
      ["Fecha del pedido","fechaPedido","Fecha"],
      ["Fecha de entrega","fechaEntrega","Fecha"],
      ["Precio total", "precioTotal", "Money"],
      ["Adeudado", "data", "Pedido Adeudado"],
      ["Productos","detalle","Largo"],
      ["Estado","estado","String"]
    ]
    const columnsProductos = [
      ["Nombre","nombre","String"],
      ["Talles","talles","Largo"], // concatenar los talles!!
    ]
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
              <div>
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
                {
                  !this.state.nuevo ?
                    <button type="button" 
                      className="btn btn-secondary ml-2"
                      onClick={() => this.goToPagos()}
                      >Ir a Pagos $</button>
                  : null
                }
              </div>
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
                onChange={this.handleOnChange}
                disabled={this.state.nuevo && permitCreate ||
                  !this.state.nuevo && permitUpdate ? false : true} />
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
                onChange={this.handleOnChange}
                disabled={this.state.nuevo && permitCreate ||
                  !this.state.nuevo && permitUpdate ? false : true} />
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
                onChange={this.handleOnChange}
                disabled={this.state.nuevo && permitCreate ||
                  !this.state.nuevo && permitUpdate ? false : true} />
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
                onChange={this.handleOnChange}
                disabled={this.state.nuevo && permitCreate ||
                  !this.state.nuevo && permitUpdate ? false : true} />
            </div>
            {/* Contactos */}
            <div className="col-12 mt-3">
              <div className="card border-primary" id="card">
                <div className="card-header d-flex justify-content-between" id="headingOne">
                  <button type="button"
                    className="btn btn-link collapsed col-sm-8 col-6"
                    data-toggle="collapse"
                    data-target="#collapseOne"
                    aria-expanded="false" 
                    aria-controls="collapseOne">
                      <h5 className="d-flex align-items-center mb-0">
                        Contactos: {this.state.contactos.length}
                        <i className="material-icons ml-3">keyboard_arrow_down</i>
                      </h5>
                    </button>
                  {
                    (
                      this.state.nuevo && permitCreate ||
                      !this.state.nuevo && permitUpdate
                    ) && 
                    <button type="button" 
                      className="btn btn-outline-success"
                      onClick={() => this.onOpenModal("modalContactos")}
                      >+ Agregar Contacto</button>
                  }
                </div>
                <div id="collapseOne" 
                  className="collapse" 
                  aria-labelledby="headingOne" 
                  data-parent="#card">
                  <div className="card-body contenedor-tabla">
                    <TablaFlexible
                      lista={"contactos"}
                      columns={columnsContactos}
                      data={this.state.contactos}
                      handleEditar={this.handleEditarContacto}
                      handleEliminar={this.handleEliminarContacto}
                      blockRead={this.state.nuevo && permitCreate ||
                        !this.state.nuevo && permitUpdate ? false : true}
                      blockDelete={this.state.nuevo && permitCreate ||
                        !this.state.nuevo && permitUpdate ? false : true}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Productos */}
            <div className="col-12 mt-3">
              <div className="card border-primary" id="card">
                <div className="card-header d-flex justify-content-between" id="headingOne">
                  <button type="button"
                    className="btn btn-link collapsed col-sm-8 col-6"
                    data-toggle="collapse"
                    data-target="#collapseThree"
                    aria-expanded="false" 
                    aria-controls="collapseThree">
                      <h5 className="d-flex align-items-center mb-0">
                        Productos disponibles: {this.state.productos.length}
                        <i className="material-icons ml-3">keyboard_arrow_down</i>
                      </h5>
                    </button>
                  {
                    (
                      this.state.nuevo && permitCreate ||
                      !this.state.nuevo && permitUpdate
                    ) && 
                    <button type="button" 
                      className="btn btn-outline-success"
                      onClick={() => this.onOpenModal("modalProductos")}
                      >+ Agregar Producto</button>
                  }
                </div>
                <div id="collapseThree" 
                  className="collapse" 
                  aria-labelledby="headingOne" 
                  data-parent="#card">
                  <div className="card-body contenedor-tabla">
                    <TablaFlexible
                      lista={"productos"}
                      columns={columnsProductos}
                      data={this.state.productos}
                      handleEditar={this.handleEditarProducto}
                      handleEliminar={this.handleEliminarProducto}
                      blockRead={this.state.nuevo && permitCreate ||
                        !this.state.nuevo && permitUpdate ? false : true}
                      blockDelete={this.state.nuevo && permitCreate ||
                        !this.state.nuevo && permitUpdate ? false : true}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Pedidos */}
            {
              !this.state.nuevo &&
              <div className="col-12 mt-3">
                <div className="card border-primary" id="card">
                  <div className="card-header d-flex justify-content-between" id="headingOne">
                    <button type="button"
                      className="btn btn-link collapsed col-sm-8 col-6"
                      data-toggle="collapse"
                      data-target="#collapseTwo"
                      aria-expanded="false" 
                      aria-controls="collapseTwo">
                        <h5 className="d-flex align-items-center mb-0">
                          Pedidos: {this.state.pedidos.length}
                          <i className="material-icons ml-3">keyboard_arrow_down</i>
                        </h5>
                      </button>
                    {
                      (
                        this.state.nuevo && permitCreate ||
                        !this.state.nuevo && permitUpdate
                      ) &&
                        <button type="button" 
                          className="btn btn-outline-success"
                          onClick={() => this.onOpenModal("modalPedidos")}
                          >+ Agregar Pedido</button>
                    }
                  </div>
                  <div id="collapseTwo" 
                    className="collapse" 
                    aria-labelledby="headingTwo" 
                    data-parent="#card">
                    <div className="card-body contenedor-tabla">
                      <TablaFlexible
                        lista={"pedidos"}
                        columns={columnsPedidos}
                        data={this.state.pedidos}
                        handleEditar={this.handleEditarPedido}
                        handleEliminar={this.handleEliminarPedido}
                        blockRead={this.state.nuevo && permitCreate ||
                          !this.state.nuevo && permitUpdate ? false : true}
                        blockDelete={this.state.nuevo && permitCreate ||
                          !this.state.nuevo && permitUpdate ? false : true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
          {/* Modal contactos */}
          <Modal
            classNames={{modal: ['modal-custom'], closeButton: ['modal-custom-button']}}
            onClose={()=>this.onCloseModal("modalContactos")}
            showCloseIcon={false}
            open={this.state.modalContactos}
            center
            >
              <ContactosEditar
                data={this.state.modalContactosEditar}
                onSave={this.onSaveModal}
                onClose={()=>this.onCloseModal("modalContactos")}
                titulo={this.state.modalContactosEditar ? "EDITAR CONTACTO" : "CREAR CONTACTO"}
              />
          </Modal>
          {/* Modal Pedidos */}
          <Modal
            classNames={{modal: ['modal-custom'], closeButton: ['modal-custom-button']}}
            onClose={()=>this.onCloseModal("modalPedidos")}
            showCloseIcon={false}
            open={this.state.modalPedidos}
            center
            >
              <PedidosEditar
                data={this.state.modalPedidosEditar}
                productos={this.state.productos}
                onSave={this.onCrearPedido}
                onClose={()=>this.onCloseModal("modalPedidos")}
                titulo={this.state.modalPedidosEditar ? "EDITAR PEDIDO" : "CREAR PEDIDO"}
              />
            </Modal>
          {/* Modal Productos */}
          <Modal
            classNames={{modal: ['modal-custom'], closeButton: ['modal-custom-button']}}
            onClose={()=>this.onCloseModal("modalProductos")}
            showCloseIcon={false}
            open={this.state.modalProductos}
            center
            >
              <ProductosEditar
                data={this.state.modalProductosEditar}
                productos={this.state.productos}
                onSave={this.onSaveModal}
                onClose={()=>this.onCloseModal("modalProductos")}
                titulo={this.state.modalProductosEditar ? "EDITAR PRODUCTO" : "CREAR PRODUCTO"}
              />
            </Modal>
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