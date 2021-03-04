// Third party components
import React from 'react'

// Custom components
import './MainHeader.css'


// props.children is a placeholder for the content
// you enter between what's inside <MainHeader></MainHeader> tags
const MainHeader = (props) => {
    return (
        <header className='main-header'>{props.children}</header>
    )
}

export default MainHeader