import React from 'react';
import MultiToggle from 'react-multi-toggle';
import './Switch.scss';


const Switch= (props)=> {
  
    return (
      <MultiToggle
        options={props.groupOptions}
        selectedOption={props.groupSize}
        onSelectOption={props.toggle}
        label=""
      />
    );
  }


export default Switch;