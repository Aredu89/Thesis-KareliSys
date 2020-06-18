import React from 'react'
import MaskedInput from 'react-text-mask'

export default function DatePicker(props) {
  const {
    value,
    onChange,
    name
  } = props

  const fechaNumeros = fecha => {
    const date = new Date(fecha)
    const dia = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const mesraw = date.getMonth() + 1
    const mes = mesraw < 10 ? '0' + mesraw : mesraw
    return dia + '/' + mes + '/' + date.getFullYear()
  }

  return(
    <div className="date-picker">
      <MaskedInput
        name={name}
        className="picker"
        onChange={onChange}
        value={value ? value : ""}
        placeholder="dd/mm/yyyy"
        mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
        />
    </div>
  )
}