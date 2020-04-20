import React from 'react'
import $ from 'jquery'
import funciones from './javascriptFunctions.js'

export default class TablaFlexible extends React.Component {
  // Props:
  // columns: Array de arrays con la siguiente estructura
  // [ ["Titulo de la columna","clave del objeto data","tipo"] ] 
  // El tipo puede ser: "String, Largo, Largo pendiente, Fecha, Money, Boolean (Muetra si / no )"
  // data: Array de objetos con los datos para completar la tabla
  // ---------- botones -------------
  // handleEditar: función para el botón editar. Parametro: _id
  // handleEliminar: función para el botón eliminar. Parametro: _id
  componentDidMount(){
    const lista = this.props.lista
    //JQuery para el filtro de la tabla
    $(document).ready(function(){
      $(`#myInput${lista}`).on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(`#myTable${lista} tr`).filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });
    });
  }
  largoPendiente(data){
    let count = 0
    data.forEach(data=>{
      if(data.estado === "pendiente"){
        count = count + 1
      }
    })
    return count
  }
  render() {
    return (
      <div className="tabla-flexible table-responsive-md">
        <input className="form-control buscador-tabla" id={`myInput${this.props.lista}`} type="text" placeholder="Buscar en la tabla..." />
        <br></br>
        <table className="table">
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
          <tbody id={`myTable${this.props.lista}`}>
            {
              this.props.data.map((data,i)=>{
                return <tr className={i%2 == 0 ? "" : "table-secondary"} key={i}>
                  {
                    this.props.columns.map((col,i)=>{
                      if(col[2] === "Largo"){
                        return <td key={i}>{data[col[1]].length}</td>
                      } else if (col[2] === "Fecha"){
                        return <td key={i}>{funciones.formatearDate(data[col[1]])}</td>
                      } else if (col[2] === "Largo pendiente"){
                        return <td key={i}>{this.largoPendiente(data[col[1]])}</td>
                      } else if(col[2] === "Money"){
                        return <td key={i}>{funciones.moneyFormatter(data[col[1]])}</td>
                      } else if(col[2] === "Boolean"){
                        return <td key={i}>{funciones.booleanFormatter(data[col[1]])}</td>
                      } else if(col[2] === "Deuda"){
                        return <td key={i}>{funciones.moneyFormatter(funciones.getDeuda(data))}</td>
                      } else {
                        return <td key={i}>{data[col[1]]}</td>
                      }
                    })
                  }
                  {/* Acciones */}
                  <td className="d-flex justify-content-end">
                    {
                      this.props.handleEditar ?
                        <button type="button" 
                          className="btn btn-outline-primary"
                          title="Editar"
                          onClick={() => this.props.handleEditar(data._id)}
                          ><i className="material-icons">create</i></button>
                      : null
                    }
                    {
                      this.props.goToPagos ?
                        <button type="button" 
                          className="btn btn-outline-primary"
                          title="Pagos"
                          onClick={() => this.props.goToPagos(data._id)}
                          ><i className="material-icons">attach_money</i></button>
                      : null
                    }
                    {
                      this.props.handleEliminar ?
                        <button type="button" 
                          className="btn btn-outline-danger"
                          title="Eliminar"
                          onClick={() => this.props.handleEliminar(data._id)}
                          ><i className="material-icons">clear</i></button>
                      : null
                    }
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