//Modal component
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group'; //transition library

import Backdrop from './Backdrop';  //Backdrop component

import './Modal.css';   //CSS styles

//component for internal use
const ModalOverlay = (props) => {
    //create modal content
    const content = (
        <div className={`modal ${props.className}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form onSubmit={props.onSubmit ? props.onSubmit : (event) => event.preventDefault()}>
                <div className={`modal__content ${props.content}`}>
                    {props.children}
                </div>
                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </div>
    );
    //create react portal with content
    return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};


function Modal(props) {
    return (
        <React.Fragment>
            {props.show && <Backdrop onClick={props.onCancel} />}
            <CSSTransition in={props.show} timeout={200} mountOnEnter unmountOnExit classNames='modal'>
                <ModalOverlay {...props} />
            </CSSTransition>
        </React.Fragment>
    );
}

export default Modal;