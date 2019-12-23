import React from 'react'

export default class TablaFlexible extends React.Component {
  // Props:
  // columns: Array de arrays con la siguiente estructura
  // [ ["Titulo de la columna","clave del objeto data","tipo"] ] el tipo puede ser: "String, Numero, Precio, Fecha"
  // data: Array de objetos con los datos para completar la tabla
  // botones: Array. ej: ["ver","editar","eliminar"]
  render() {
    return (
      <div className="tabla-flexible">
        Tabla
      </div>
    )
  }
}