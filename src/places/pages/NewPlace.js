//NewPlace page
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';          //useHistory hook

import Input from '../../shared/components/FormElements/Input';                 //Input component
import ImageUpload from '../../shared/components/FormElements/ImageUpload';     //ImageUpload component
import Button from '../../shared/components/FormElements/Button';               //Button component
import ErrorModal from '../../shared/components/UIElements/ErrorModal';         //ErrorModal component
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'; //LoadingSpinner component

import './PlaceForm.css';  //CSS style

import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from '../../shared/util/validators'; //validating functions
import { useForm } from '../../shared/hooks/form-hook';         //forms custom hook
import { useHttpClient } from '../../shared/hooks/http-hook';   //httpClient custom hook
import { AuthContext } from '../../shared/context/auth-context' //auth context API

function NewPlace() {
    //connect to auth context
    const authCtx = useContext(AuthContext);

    //call useForm custom hook with initialInputs and initialValidity
    const [formState, inputHandler] = useForm({
        title: {
          value: '',
          isValid: false,
        },
        description: {
          value: '',
          isValid: false,
        },
        address: {
          value: '',
          isValid: false,
        },
        image: {
          value: null,
          isValid: false,
        }
    }, false);  

    //call useHttpClient custom hook
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    //get history object
    const history = useHistory();

    //function to handle subittion
    const submitHandler = async (event) => {
      //prevent refresh
      event.preventDefault();
      
      //try to send POST request to API
      try {
        //new formData object
        const formData = new FormData();
        //append inputs to formData
        formData.append('title', formState.inputs.title.value);
        formData.append('description', formState.inputs.description.value);
        formData.append('address', formState.inputs.address.value);
        formData.append('image', formState.inputs.image.value);

        //send request with function from custom hook
        await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/places',
          'POST',
          formData,
          { Authorization: 'Bearer ' + authCtx.token }    //set authorization header with token
        );
        // Redirect user to starting page(but allow it to go back)
        history.push('/');

      } catch (err) {
        //no need to do anything, error state is manages in custom hook
      }     
    };

    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        <form className='place-form' onSubmit={submitHandler}>
          {isLoading && <div className='center'> <LoadingSpinner asOverlay /> </div>}
          <Input
            id='title'
            element='input' 
            type='text' 
            label='Title' 
            validators={[VALIDATOR_REQUIRE()]} 
            errorText='Please enter a valid title.'
            onInput={inputHandler}
          />
          <Input
            id='description'
            element='textarea'
            label='Description' 
            validators={[VALIDATOR_MINLENGTH(5)]} 
            errorText='Please enter a valid description(at least 5 characters).'
            onInput={inputHandler}
          />
          <Input
            id='address'
            element='input' 
            type='text' 
            label='Address' 
            validators={[VALIDATOR_REQUIRE()]} 
            errorText='Please enter a valid address.'
            onInput={inputHandler}
          />
          <ImageUpload center id='image' onInput={inputHandler} errorText='Please provide an image' />
          <Button type='submit' disabled={!formState.isValid}>ADD PLACE</Button>          
        </form>
      </React.Fragment>
    );
}

export default NewPlace;