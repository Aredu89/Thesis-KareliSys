import React from 'react'
import TablaFlexible from '../common/TablaFlexible.jsx'
import funciones from '../common/javascriptFunctions.js'
import Swal from 'sweetalert2'

export default class UsuariosLista extends React.Component {
  constructor() {
    super()
    this.state = {
      usuarios: [],
      cargando: true,
      error: ""
    }

  }

  render() {
    return (
      <div className="usuarios-lista">
        Lista de Usuarios
      </div>
    )
  }
}