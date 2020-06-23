import React from 'react'
import MaskedInput from 'react-text-mask'

export default function DatePicker(props) {
  const {
    value,
    onChange,
    name,
    error
  } = props

  return(
    <div className="date-picker">
      <MaskedInput
        name={name}
        className={error ? "picker form-control is-invalid" : "form-control picker"}
        onChange={onChange}
        value={value ? value : ""}
        placeholder="dd/mm/yyyy"
        mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
        />
      {error && 
        <div className="invalid-feedback">Ingrese una fecha</div>
      }
    </div>
  )
}