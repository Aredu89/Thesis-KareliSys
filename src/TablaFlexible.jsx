import React from 'react'
import $ from 'jquery'

export default class TablaFlexible extends React.Component {
  // Props:
  // columns: Array de arrays con la siguiente estructura
  // [ ["Titulo de la columna","clave del objeto data","tipo"] ] el tipo puede ser: "String, Numero, Precio, Fecha"
  // data: Array de objetos con los datos para completar la tabla
  // botones: Array. ej: ["ver","editar","eliminar"]
  // handleEditar: función para el botón editar
  // handleEliminar: función para el botón eliminar
  componentDidMount(){
    //JQuery para el filtro de la tabla
    $(document).ready(function(){
      $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });
    });
  }
  render() {
    return (
      <div className="tabla-flexible table-responsive-md">
        <input className="form-control buscador-tabla" id="myInput" type="text" placeholder="Buscar en la tabla..." />
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
          <tbody id="myTable">
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
                    <button type="button" 
                      className="btn btn-outline-primary"
                      title="Editar"
                      onClick={
                        this.props.handleEditar ?
                          () => this.props.handleEditar(data._id)
                        :
                          () => console.log("No se definió un controlador para el click")
                      }
                      ><i className="material-icons">create</i></button>
                    <button type="button" 
                      className="btn btn-outline-danger"
                      title="Eliminar"
                      onClick={
                        this.props.handleEliminar ?
                          () => this.props.handleEliminar(data._id)
                        :
                          () => console.log("No se definió un controlador para el click")
                      }
                      ><i className="material-icons">clear</i></button>
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