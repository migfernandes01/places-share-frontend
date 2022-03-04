//PlaceItem component
import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';                             //Card component
import Button from '../../shared/components/FormElements/Button';                       //Button component
import Modal from '../../shared/components/UIElements/Modal';                           //Modal component
import Map from '../../shared/components/UIElements/Map';                               //Map component
import ErrorModal from '../../shared/components/UIElements/ErrorModal';                 //ErrorModal component
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';         //LoadingSpinner component

import './PlaceItem.css'; //CSS styles

import { AuthContext } from '../../shared/context/auth-context';    //Context API
import { useHttpClient } from '../../shared/hooks/http-hook';       //http custom hook

function PlaceItem(props) {
    //show map state
    const [showMap, setShowMap] = useState(false);
    //show confirm modal state
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    //use custom hook
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    //connect to context API
    const authCtx = useContext(AuthContext);

    //function to handle map opening
    const openMapHandler = () => {
        //open map modal
        setShowMap(true);
    };

    //function to handle map closing
    const closeMapHandler = () => {
        //close map modal
        setShowMap(false);
    };

    //function to handle showing the warning modal
    const showDeleteWarningHandler = () => {
        //open confirm modal
        setShowConfirmModal(true);
    };

    //function to handle closing the warning modal
    const cancelDeleteWarningHandler = () => {
        //close confirm modal
        setShowConfirmModal(false);
    };

    //function handle place deletion
    const confirmDeleteHandler = async () => {
        //close confirm modal
        setShowConfirmModal(false);
        
        //try to send a DELETE request to API
        try {
            //send DELETE request to API
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`,     //API endpoint
                'DELETE',                                           //request method
                null,                                               //request body
                { Authorization: 'Bearer ' + authCtx.token }        //request headers (token)
            );
            //call function through props with the id of the place to delete
            props.onDelete(props.id);

        } catch (err) {
            //no need to do anything because we handle the error state in custom hook
        }
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showMap} 
                onCancel={closeMapHandler} 
                header={props.address} 
                contentClass='place-item__modal-content' 
                footerClass='place-item__modal-actions'
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}    
            >
                <div className='map-container'>
                    <Map coordinates={props.coordinates} />
                </div>
            </Modal>

            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteWarningHandler}
                header='Are you sure?'
                footerClass='place-item__modal-actions'
                footer={
                    <React.Fragment>
                        <Button inverse onClick={cancelDeleteWarningHandler}>CANCEL</Button>
                        <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                    </React.Fragment>
                }    
            >
                <p>Do you want to proceed and delete this place? Please note that
                    it can't be undone thereafter. </p>
            </Modal>

            <li className='place-item'>
                <Card className='place-item__content'>
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className='place-item_image'>
                        <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
                    </div>
                    <div className='place-item__info'>
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className='place-item__actions'>
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        {authCtx.userId === props.creatorId && (
                            <Button to={`/places/${props.id}`}>EDIT</Button>
                        )}
                        {authCtx.userId === props.creatorId && (
                            <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>
                        )}                 
                    </div>
                </Card>
            </li>
        </React.Fragment>
    );
}

export default PlaceItem;