//NavLinks component
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom'; //NavLink from react-router-dom

import './NavLinks.css';    //CSS styles

import { AuthContext } from '../../context/auth-context';   //ContextAPI

function NavLinks(props) {
    //connect to context API
    const authCtx = useContext(AuthContext);

    return (
        <ul className='nav-links'>
            <li>
                <NavLink to='/' exact>USERS</NavLink>
            </li>
            {authCtx.isLoggedIn && (
                <li>
                    <NavLink to={`/${authCtx.userId}/places`}>MY PLACES</NavLink>
                </li>
            )}
            {authCtx.isLoggedIn && (
                <li>
                    <NavLink to='/places/new'>ADD PLACE</NavLink>
                </li>
            )}
            {!authCtx.isLoggedIn && (
                <li>
                    <NavLink to='/auth'>LOGIN/SIGNUP</NavLink>
                </li>
            )}
            {authCtx.isLoggedIn && (
                <li>
                    <button onClick={authCtx.logout}>LOGOUT</button>
                </li>
            )}
        </ul>
    );
}

export default NavLinks;