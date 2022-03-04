//UsersList component
//3rd party libraries
import React from 'react';

//External components
import UserItem from './UserItem';                          //UserItem component
import Card from '../../shared/components/UIElements/Card'; //Card component

import './UsersList.css';           //CSS styles

function UsersList(props) {
    //if items array is empty
    if(props.items.length === 0){
        return (
            <div className='center'>
                <Card>
                    <h2>No users found.</h2>
                </Card>
            </div>
        );
    }
    //if we have at least one user
    return (
        <ul className='users-list'>
            {props.items.map(user => (
                <UserItem
                    key={user.id}
                    id={user.id}
                    image={user.image}
                    name={user.name}
                    placeCount={user.places.length}
                />
            ))}
        </ul>
    );
}

export default UsersList;