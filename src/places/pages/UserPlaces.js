//User places page
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';                                       //React-router-dom

import PlaceList from '../components/PlaceList';                                    //PlaceList component
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';     //LoadingSpinner component

import { useHttpClient } from '../../shared/hooks/http-hook';                       //custom hook


function UserPlaces() {
    //loadedPlaces state
    const [loadedPlaces, setLoadedPlaces] = useState([]);
    //extract userId from params
    const userId = useParams().userId;
    
    //use custom hook
    const { isLoading, sendRequest} = useHttpClient();

    //run when component mounts
    useEffect(() => {
        //function to fetch places from API
        const fetchPlaces = async () => {
            try {
                //send GET request to /api/places/:userId
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`); 
                setLoadedPlaces(responseData.places);
            } catch (err) {
                //no need to do anything here, since we handle error state in custom hook
            }
            
        };

        //call async function to fetch places
        fetchPlaces();
    }, [sendRequest, userId]);

    //function that filters the prev state of loaded places and sets a new loaded places state
    const placeDeletedHandler = (deletedPlaceId) => {
        //filter the prev state of places and keep the ones that are different from the place with
        //id we get in as an argument and set those new places as loaded places
        setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId ));
    };

    return (
        <React.Fragment>
            {/*error && <ErrorModal error={error} onClear={clearError} />*/}
            {isLoading && <div className='center'> <LoadingSpinner /> </div>}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
        </React.Fragment>
    );
}

export default UserPlaces;