import React from 'react';
import Box from './Box/Box';
import './Seperator.scss';
const Seperator = (props)=>{
    return(
        <div className="Seperator">
            <ul >
            <Box />
            <Box />
            <Box />
            </ul>
        </div>
    );
};

export default Seperator;