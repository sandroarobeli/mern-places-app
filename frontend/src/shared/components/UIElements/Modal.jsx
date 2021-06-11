// Third party components
import React from 'react'
import ReactDOM from 'react-dom'
import { CSSTransition } from 'react-transition-group'

// Custom components
import Backdrop from './Backdrop'
import './Modal.css'

// This components is for internal use only (by Modal)
const ModalOverlay = props => {
    const content = (
        <div className={`modal ${props.className}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form onSubmit={
                props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
            }
            >
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>
                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </div>
    );
    return ReactDOM.createPortal(content, document.getElementById('modal-hook'))
}

const Modal = props => {
    return (
        <React.Fragment>
            {props.show && <Backdrop onClick={props.onCancel} />}
            <CSSTransition in={props.show} mountOnEnter unmountOnExit timeout={200} classNames='modal'>
                {/* {...props} syntax forwards props to a component that uses them */}    
                <ModalOverlay {...props} />
            </CSSTransition>
        </React.Fragment>
    )
}

export default Modal