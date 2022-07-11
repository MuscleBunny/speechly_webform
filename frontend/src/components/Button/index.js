import './index.css'
import {useEffect, useState} from 'react'

function Button(props) {
  return (
    <a className={'button ' + props.className } onClick={props.onClick}>
      {props.children}
    </a>
  );
}

export default Button;
