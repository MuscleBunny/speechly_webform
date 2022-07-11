import './index.css'
import Button from '../../components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

function Modal(props) {
  const {show, close, okAction, cancelAction, okName, cancelName} = props;
  return (
    <>{
      show ?
      <div className='custom-modal' onClick={(e) => {e.stopPropagation(); close()}}>
        <div className='custom-modal-content' onClick={(e)=>{e.stopPropagation()}}>
        <div className='custom-modal-header'><span>{props.title}</span>
            <Button className='info-button' onClick={cancelAction}><FontAwesomeIcon icon={faClose} /></Button></div>
          <div className='custom-modal-body'>
            {props.children}
          </div>
          <div className='custom-modal-footer'>
            <Button className='primary-button' onClick={okAction}>{okName}</Button>
            <Button className='info-button' onClick={cancelAction}>{cancelName}</Button>
          </div>
        </div>
      </div>
      : null
    }</>
  );
}

export default Modal;
