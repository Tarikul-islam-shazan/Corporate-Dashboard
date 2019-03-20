import React from 'react';

const Logo= (props)=> {
  
    return (
      
          <img src={require('../../assets/images/meed_logo.png')} alt="meed logo" className={props.meed_logo} />
      
    );
  }


export default Logo;