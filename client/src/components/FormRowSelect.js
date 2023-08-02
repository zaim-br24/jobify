import React from 'react'

export default function FormRowSelect({name, value, labelText, handleChange, options}) {
  return (
    <div className='form-row'>
    <label htmlFor={name} className='form-lable'>{labelText || name}</label>
    <select className='form-select' name={name} value={value} onChange={handleChange}>
      {options.map((item, index)=>{
        return(
          <option key={index} value={item}>
          {item}
        </option>
        )
      })}
    </select>
  </div>
  )
}

