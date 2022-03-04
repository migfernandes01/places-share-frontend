//PlaceList component
import React from 'react';

import Card from '../../shared/components/UIElements/Card';         //Card component
import PlaceItem from './PlaceItem';                                //PlaceItem component
import Button from '../../shared/components/FormElements/Button';   //Button component

import './PlaceList.css'; //CSS styles

function PlaceList(props) {
    //if items array is empty
    if(props.items.length === 0){
        return (
            <div className='place-list center'>
                <Card>
                    <h2>No places found.</h2>
                    <Button to='/places/new'>Share place</Button>
                </Card>
            </div>
        );
    }

    return (
        <ul className='place-list'>
            {props.items.map(place => (
                <PlaceItem
                    key={place.id}
                    id={place.id}
                    image={place.image}
                    title={place.title}
                    description={place.description}
                    address={place.address}
                    creatorId={place.creator}
                    coordinates={place.location} 
                    onDelete={props.onDeletePlace}
                />))}
        </ul>
    );
}

export default PlaceList;