import './index.css'
import {useEffect, useState} from 'react'
import Button from '../../components/Button'

function Modal(props) {
  const {show, close, okAction, cancelAction, okName, cancelName} = props;
  return (
    <>{
      show ?
      <div className='custom-modal' onClick={(e) => {e.stopPropagation(); close()}}>
        <div className='custom-modal-content' onClick={(e)=>{e.stopPropagation()}}>
          <div className='custom-modal-body'>
            {props.children}
          </div>
          <div className='custom-modal-footer'>
            <Button onClick={okAction}>{okName}</Button>
            <Button onClick={cancelAction}>{cancelName}</Button>
          </div>
        </div>
      </div>
      : null
    }</>
  );
}

export default Modal;
