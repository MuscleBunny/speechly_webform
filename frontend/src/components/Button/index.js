import './index.css'
import {useEffect, useState} from 'react'

function Button(props) {
  return (
    <a className='button' onClick={props.onClick}>
      {props.children}
    </a>
  );
}

export default Button;
