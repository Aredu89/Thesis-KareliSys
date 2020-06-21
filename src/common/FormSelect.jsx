import React from 'react'

export default function FormSelect(props) {
  const {
    label,
    options,
    name,
    value,
    onChange
  } = props

  let selectOptions = []

  if(options){
    if(options.length > 0){
      selectOptions.push({
        id: "",
        value: "-sin seleccionar-"
      })
      options.forEach(opt=>{
        selectOptions.push(opt)
      })
    }
  }

  return(
    <div className="form-select">
      {
        label &&
        <div className="mb-2">{label}</div>
      }
      <select
        className='select mb-2'
        name={name}
        value={value}
        onChange={onChange}
      >
        {
          selectOptions.length > 0 ? (
            selectOptions.map((opt, i)=>{
              return <option key={i} value={opt.id}>{opt.value}</option>
            })
          ) : (
            <option>Sin opciones...</option>
          )
        }
      </select>
    </div>
  )
}