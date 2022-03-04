//MainHeader component
import React from 'react';

import './MainHeader.css';  //CSS styles

function MainHeader(props) {
    return (
        <header className='main-header'>
            {props.children}
        </header>
    );
}

export default MainHeader;