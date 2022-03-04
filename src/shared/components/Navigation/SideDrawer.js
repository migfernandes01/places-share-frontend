//SideDrawer component
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group'; //Transition library

import './SideDrawer.css';  //CSS styles

function SideDrawer(props) {
    const content = (
        <CSSTransition in={props.show} timeout={200} classNames='slide-in-left' mountOnEnter unmountOnExit>
            <aside className='side-drawer' onClick={props.onClick}>
                {props.children}
            </aside>
        </CSSTransition>
    );
    //create a react portal with the content in the index.html
    return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
}

export default SideDrawer;