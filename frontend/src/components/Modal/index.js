import './index.css'

function Modal(props) {
  return (
    <div className='custom-modal'>
      <div className='custom-modal-content'>
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
