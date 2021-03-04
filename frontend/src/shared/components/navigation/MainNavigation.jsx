// Third party components
import React from 'react'
import { Link } from 'react-router-dom'

// Custom components
import MainHeader from './MainHeader'
import NavLinks from './NavLinks'
import './MainNavigation.css'

const MainNavigation = (props) => {
    return (
        <MainHeader>
            <button className='main-navigation__menu-btn'>
                <span />
                <span />
                <span />
            </button>
            <h1 className='main-navigation__title'>
                <Link to='/'>MERNplaces</Link>
            </h1>
            <nav>
                <NavLinks />
            </nav>
        </MainHeader>
    )
}

export default MainNavigation