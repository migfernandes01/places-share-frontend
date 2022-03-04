//UpdatePlace page
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Button from '../../shared/components/FormElements/Button';                   //Button component
import Input from '../../shared/components/FormElements/Input';                     //Input component
import Card from '../../shared/components/UIElements/Card';                         //Card component
import ErrorModal from '../../shared/components/UIElements/ErrorModal';             //ErrorModal component
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';     //Loading spinner component

import './PlaceForm.css';  //CSS style

import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';  //External form validators
import { useForm } from '../../shared/hooks/form-hook';         //useForm custom hook
import { useHttpClient } from '../../shared/hooks/http-hook';   //useHttpClient 

import { AuthContext } from '../../shared/context/auth-context';    //AuthContext


function UpdatePlace() {
    //loadedPlace state
    const [loadedPlace, setLoadedPlace] = useState();

    //get placeId from params
    const placeId = useParams().placeId;

    //connect to context API
    const authCtx = useContext(AuthContext);

    //use http custom hook
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    //get history object
    const history = useHistory();

    //call custom hook with formInput and formValidity
    const [formState, inputHandler, setFormData] = useForm({
        title:{
            value: '',
            isValid: false,
        },
        description:{
            value: '',
            isValid: false,
        }
    }, false);

    //fetch place when component mounts
    useEffect(() => {
        //function that fetches place
        const fetchPlace = async () => {
            try {
                //send GET request to API
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);
                //set loaded place
                setLoadedPlace(responseData.place);

                //use function from custom hook to set data in form to loaded place
                setFormData({
                    title: {
                        value: responseData.place.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.place.description,
                        isValid: true
                    }
                }, true);

            } catch (err) {
                //don't need to do anything since we handle error state in custom hook
            }
        };
        
        //call function to fetch place
        fetchPlace();
    }, [sendRequest, placeId, setFormData]);

    //function that handles form submittion
    const placeUpdateSubmitHandler = async (event) => {
        //prevent refresh
        event.preventDefault();
        
        //create request body
        const requestBody = JSON.stringify({
            title: formState.inputs.title.value,
            description: formState.inputs.description.value,
        });

        //create request headers (with JSON + token)
        const requestHeaders = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + authCtx.token    //set authorization header with token
        };

        try {
            //send PATCH request to API
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
                'PATCH',
                requestBody,
                requestHeaders
            );
            //get userId
            const userId = loadedPlace.creator;
            //redirect to user places
            history.push(`/${userId}/places`);

        } catch (err) {
            //don't need to do anything here since we handle error state in custom hook
        }
        
    };

    //if isLoading
    if(isLoading){
        return (
            <div className='center'>
                <LoadingSpinner />
            </div>
        );
    }

    //if we could not identify a place
    if(!isLoading && !loadedPlace && !error){
        return (
            <div className='center'>
                <Card>
                    <h2>Could not find place.</h2>
                </Card>
            </div>
        );
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && !error && loadedPlace && (<form className='place-form' onSubmit={placeUpdateSubmitHandler}>
                <Input
                    id='title' 
                    element='input' 
                    type='text'
                    label='Title'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText='Please enter a valid title.'
                    onInput={inputHandler}
                    value={loadedPlace.title}
                    isValid={true}
                />
                <Input
                    id='description' 
                    element='textarea'
                    label='Description'
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText='Please enter a valid description (min 5 characters).'
                    onInput={inputHandler}
                    value={loadedPlace.description}
                    isValid={true}
                />
                <Button type='submit' disabled={!formState.isValid}>UPDATE PLACE</Button>
            </form>)}
        </React.Fragment>
    );
}

export default UpdatePlace;