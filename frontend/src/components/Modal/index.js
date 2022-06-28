import './index.css'
import {useEffect, useState} from 'react'

function Modal(props) {
  const [ isOpen, setIsOpen ] = useState(true);
  const {show, close} = props;
  return (
    <>{
      show ?
      <div className='custom-modal' onClick={(e) => {e.stopPropagation(); close()}}>
        <div className='custom-modal-content' onClick={(e)=>{e.stopPropagation()}}>
          {props.children}
        </div>
      </div>
      : null
    }</>
  );
}

export default Modal;
