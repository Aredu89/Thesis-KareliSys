import React from'react'
import DatePicker from '../common/DatePicker.jsx'
import Funciones from '../common/javascriptFunctions.js'
import TablaFlexible from '../common/TablaFlexible.jsx'

export default class EgresosFecha extends React.Component {
	constructor(){
		super()
		this.state = {
			desde: "",
			errorDesde: "",
			hasta: "",
			errorHasta: "",
			egresos: 0,
			cargandoEgresos: true,
			errorEgresos: "",
			detalleEgresos: []
		}
		this.handleOnChange = this.handleOnChange.bind(this)
		this.onClickConsultar = this.onClickConsultar.bind(this)
		this.cargarEgresos = this.cargarEgresos.bind(this)
	}

	componentDidMount(){
		this.cargarEgresos()
	}

	cargarEgresos(){
		fetch(`/api/egresos?desde=${this.state.desde}&hasta=${this.state.hasta}`)
			.then(res => {
				if(res.ok) {
					res.json()
					.then(data=>{
						this.setState({
							cargandoEgresos: false,
							errorEgresos: "",
							egresos: data.egresosMes,
							detalleEgresos: data.detalleEgresosMes
						})
					})
				} else {
					res.json()
					.then(error => {
						console.log("Error al obtener egresos. ", error.message)
						this.setState({
							cargandoEgresos: false,
							errorEgresos: error.message
						})
					})
				}
			})
			.catch(error => {
				console.log("Error: ",error.message)
				this.setState({
					cargandoEgresos: false,
					errorEgresos: error.message
				})
			})
	}

	handleOnChange(event){
		this.setState({
			[event.target.name]: event.target.value
		})
		//Limpio el error Desde
		if(event.target.name === "desde"){
			this.setState({
				errorDesde: ""
			})
		}
		//Limpio el error Hasta
		if(event.target.name === "hasta"){
			this.setState({
				errorHasta: ""
			})
		}
	}

	onClickConsultar(){
		this.cargarEgresos()
	}

	render() {
		const columns = [
			["Fabrica","fabrica","String"],
			["Monto","monto","Money"],
			["Fecha","fecha","Fecha"],
		]
		return(
			<div className="fabricas-pagos text-center">
				<div className="row">
					{/* Titulo */}
					<div className="col-12 d-flex">
						<h3>Reporte de Egresos por fecha</h3>
					</div>
					{/* Filtro de fechas */}
					<div className="col-12 d-flex align-items-center">
						<span className="mr-2">Desde</span>
						<DatePicker
							name="desde"
							value={this.state.desde ? this.state.desde : ""}
							onChange={this.handleOnChange}
							error={this.state.errorDesde}
							/>
						<span className="mr-2 ml-2">Hasta</span>
						<DatePicker
							name="hasta"
							value={this.state.hasta ? this.state.hasta : ""}
							onChange={this.handleOnChange}
							error={this.state.errorHasta}
							/>
						<button 
							type="button"
							className="btn btn-success ml-2"
							onClick={this.onClickConsultar}
							>Consultar</button>
					</div>
					{/* Total de egresos */}
					<div className="mensaje-deuda">
						<h4>El total de egresos es de: {Funciones.moneyFormatter(this.state.egresos)}</h4>
					</div>
					{/* Detalle */}
					<div className="col-12 contenedor-tabla text-center">
					{
              !this.state.cargandoEgresos ?
                // Tabla
                <TablaFlexible
                  columns={columns}
									data={this.state.detalleEgresos}
									sinAcciones={true}
                />
              :
                this.state.errorEgresos ?
                  //Mensaje de error
                  <div className="alert alert-dismissible alert-danger">
                    <button type="button" className="close" data-dismiss="alert">&times;</button>
                    <strong>Error!</strong> {this.state.errorEgresos}
                  </div>
                :
                  // Spinner
                  <div className="spinner-border text-light" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
            }
					</div>
				</div>
			</div>
		)
	}
}