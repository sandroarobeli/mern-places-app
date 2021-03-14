// Third party components
import React from 'react'
import ReactDom from 'react-dom'
import { CSSTransition } from 'react-transition-group'

// Custom components
import './SideDrawer.css'

const SideDrawer = (props) => {
    const content = (
        <CSSTransition 
            in={props.show} 
            timeout={200} 
            classNames='slide-in-left'
            mountOnEnter 
            unmountOnExit
        >
            <aside className='side-drawer' onClick={props.onClick}>{props.children}</aside>
        </CSSTransition>
    )    
    // Employing PORTALs allows outputting elements elsewhere in DOM tree
    return ReactDom.createPortal(content, document.getElementById('drawer-hook'))
}

export default SideDrawer