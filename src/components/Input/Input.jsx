import React from 'react';
import './Input.scss';
const Input = (props) => {
  return (
    <div className='group'>
      <input
        className='inputMaterial'
        type={props.type}
        value={props.data}
        onChange={props.change}
        name={props.name}
        maxLength={props.maxLength ? props.maxLength : null}
        minLength={props.minLength ? props.minLength : null}
        required
      />
      <span className='highlight'></span>
      <span className='bar'></span>
      <label>{props.text}</label>
    </div>
  );
};

export default Input;
