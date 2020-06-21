import React from 'react'
import MaskedInput from 'react-text-mask'

export default function DatePicker(props) {
  const {
    value,
    onChange,
    name
  } = props

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