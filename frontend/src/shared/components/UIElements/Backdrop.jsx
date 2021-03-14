// Third party components
import React from 'react'
import ReactDOM from 'react-dom'

// Custom components
import './Backdrop.css'

const Backdrop = (props) => {
    const backdrop = <div className='backdrop' onClick={props.onClick}></div>
    // Employing PORTALs allows outputting elements elsewhere in DOM tree
    return ReactDOM.createPortal(backdrop, document.getElementById('backdrop-hook'))
}

export default Backdrop