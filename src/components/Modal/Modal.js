import React from 'react';
import './Modal.scss';

const Modal = ({ children, closeModal, modalState, title }) => {
  if(!modalState) {
    return null;
  }
  
  return(
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
      
        <section className="modal-card-body">
          <div className="content modalBody">
            <div className="modalBodyHeader">
              {title}
            </div>
            <div className="modalMainBody">
            {children}
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}



export default Modal;