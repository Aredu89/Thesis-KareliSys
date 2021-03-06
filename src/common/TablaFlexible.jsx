import React from 'react'
import $ from 'jquery'
import funciones from './javascriptFunctions.js'

export default class TablaFlexible extends React.Component {
  constructor(props){
    super(props)
    this.blockRead = props.blockRead ? props.blockRead : false
    this.blockDelete = props.blockDelete ? props.blockDelete : false
  }
  // Props:
  // columns: Array de arrays con la siguiente estructura
  // [ ["Titulo de la columna","clave del objeto data","tipo"] ] 
  // El tipo puede ser:
  // -- String, Largo, Largo pendiente, Fecha, Money, Boolean (Muetra si / no )
  // -- Pedido Adeudado, Fabrica Adeudado
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
        <input
          className="form-control buscador-tabla"
          id={`myInput${this.props.lista}`}
          type="text"
          placeholder="Buscar en la lista..."
          />
        <br></br>
        <table className="table">
          <thead>
            <tr className="table-primary">
              {
                this.props.columns.map((col,i)=>{
                  return <th scope="col" key={i}>{col[0]}</th>
                })
              }
              {
                this.props.sinAcciones ?
                null :
                <th scope="col" className="d-flex justify-content-end">Acciones</th>
              }
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
                        return <td key={i}>{data[col[1]] ? funciones.formatearDate(data[col[1]]) : "-"}</td>
                      } else if (col[2] === "Largo pendiente"){
                        return <td key={i}>{this.largoPendiente(data[col[1]])}</td>
                      } else if(col[2] === "Money"){
                        return <td key={i}>{data[col[1]] ? funciones.moneyFormatter(data[col[1]]) : "-"}</td>
                      } else if(col[2] === "Boolean"){
                        return <td key={i}>{funciones.booleanFormatter(data[col[1]])}</td>
                      } else if(col[2] === "Deuda"){
                        return <td key={i}>{funciones.moneyFormatter(funciones.getDeuda(data))}</td>
                      } else if(col[2] === "Pedido Adeudado"){
                        return <td key={i}>{funciones.moneyFormatter(funciones.getDeudaPedido(data))}</td>
                      } else if(col[2] === "Fabrica Adeudado"){
                        return <td key={i}>{funciones.moneyFormatter(funciones.getDeudaFabrica(data))}</td>
                      } else {
                        return <td key={i}>{data[col[1]]}</td>
                      }
                    })
                  }
                  {/* Acciones */}
                  {
                    this.props.sinAcciones ?
                    null :
                    <td className="d-flex justify-content-end">
                      {
                        this.props.handleEditar && !this.blockRead ?
                          <button type="button" 
                            className="btn btn-outline-primary"
                            title="Editar"
                            onClick={() => this.props.handleEditar(data._id)}
                            ><i className="material-icons">create</i></button>
                        : null
                      }
                      {
                        this.props.goToPedidos && !this.blockRead ?
                          <button type="button" 
                            className="btn btn-outline-primary"
                            title="Pedidos"
                            onClick={() => this.props.goToPedidos(data._id)}
                            ><i className="material-icons">shopping_cart</i></button>
                        : null
                      }
                      {
                        this.props.goToPagos && !this.blockRead ?
                          <button type="button" 
                            className="btn btn-outline-primary"
                            title="Pagos"
                            onClick={() => this.props.goToPagos(data._id)}
                            ><i className="material-icons">attach_money</i></button>
                        : null
                      }
                      {
                        this.props.handleEliminar && !this.blockDelete ?
                          <button type="button" 
                            className="btn btn-outline-danger"
                            title="Eliminar"
                            onClick={() => this.props.handleEliminar(data._id)}
                            ><i className="material-icons">clear</i></button>
                        : null
                      }
                      {
                        this.props.onPagarPedido && !this.blockRead ?
                          <button type="button" 
                            className="btn btn-outline-primary pagar"
                            title="Pagos"
                            onClick={() => this.props.onPagarPedido(data)}
                            >PAGAR</button>
                        : null
                      }
                    </td>
                  }
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}