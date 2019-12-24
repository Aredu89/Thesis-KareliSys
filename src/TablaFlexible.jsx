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
        <table className="table table-hover">
          <thead>
            <tr className="table-primary">
              {
                this.props.columns.map((col,i)=>{
                  return <th scope="col" key={i}>{col[0]}</th>
                })
              }
              <th scope="col" className="d-flex justify-content-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.data.map((data,i)=>{
                return <tr className={i%2 == 0 ? "" : "table-secondary"} key={i}>
                  {
                    this.props.columns.map((col,i)=>{
                      return <td key={i}>{data[col[1]]}</td>
                    })
                  }
                  {/* Acciones */}
                  <td className="d-flex justify-content-end">
                    <button type="button" className="btn btn-outline-secondary">Editar</button>
                    <button type="button" className="btn btn-outline-danger">Eliminar</button>
                  </td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}