//Auth page
import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';                     //Card component
import Input from '../../shared/components/FormElements/Input';                 //Input component
import ImageUpload from '../../shared/components/FormElements/ImageUpload';     //ImageUpload component
import Button from '../../shared/components/FormElements/Button';               //Button component
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'; //LoadingSpinner component
import ErrorModal from '../../shared/components/UIElements/ErrorModal';         //ErrorModal

import {VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';          //Validators
import { useForm } from '../../shared/hooks/form-hook';                     //useForm custom hook
import { useHttpClient } from '../../shared/hooks/http-hook';               //useHttpClient custom hook

import './Auth.css';    //CSS styles

import { AuthContext } from '../../shared/context/auth-context';    //Context API

function Auth() {
    //isLogin state
    const [isLogin, setIsLogin] = useState(true); 
    
    //connect to context API
    const authCtx = useContext(AuthContext);

    //useFrom custom hook
    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false,
        },
        password: {
            value: '',
            isValid: false,
        }
    }, false);

    //useHttpClient custom hook
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    //function to handle auth form submittion
    const authSubmitHandler = async (event) => {
        //prevent refresh
        event.preventDefault();

        console.log(formState.inputs);

        //create request headers
        const requestHeaders = { 'Content-Type': 'application/json' }

        //if is login option
        if(isLogin){  
            try {
                //create request body
                const requestBody = JSON.stringify({
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                });

                //call sendRequest on useHttpClient custom hook and get response data
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/users/login',
                    'POST',
                    requestBody,
                    requestHeaders
                );
                        
                //call login function from context API
                authCtx.login(responseData.userId, responseData.token);

            } catch (err) {
                //empty because we handle error state on the custom hook
            }         
            
        }else{  //if is signup option
            try {
                //create new FormData object
                const formData = new FormData();
                //append data(from inputs) to formData
                formData.append('email', formState.inputs.email.value);
                formData.append('name', formState.inputs.name.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                
                //call sendRequest on useHttpClient custom hook and get response data
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/users/signup',
                    'POST',
                    formData,   //send formData as request body
                    //no need to send headers, it sets automatically
                );
                        
                //call login function from context API
                authCtx.login(responseData.userId, responseData.token);
                
            } catch (error) {
                //empty because we handle error state on the custom hook
            }
            
        }
    };

    //function to log as test user
    const loginTestUser = async (event) => {
        event.preventDefault();
        
        try {
            //create request headers
            const requestHeaders = { 'Content-Type': 'application/json' }
            //create request body
            const requestBody = JSON.stringify({
                email: 'test@user.com',
                password: 'testuser'
            });

            //call sendRequest on useHttpClient custom hook and get response data
            const responseData = await sendRequest(
                process.env.REACT_APP_BACKEND_URL + '/users/login',
                'POST',
                requestBody,
                requestHeaders
            );

            //call login function from context API
            authCtx.login(responseData.userId, responseData.token);
        } catch (error) {
            
        }
    }

    //function to handle switch mode 
    const switchModeHandler = () => {
        //if we are signing up and switching to login
        if(!isLogin){
            setFormData({
                ...formState.inputs,    //spread the other input fields
                name: undefined,        //drop name field
                image: undefined,       //drop image field
            }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        }else{  //login switching to signup
            setFormData({
                ...formState.inputs,    //spread the other input fields
                name: {                 //set new name to '' and isValid is false
                    value: '',
                    isValid: false,
                },
                image: {                //set new image to null and not valid
                    value: null,
                    isValid: false,
                }
            }, false);
        }
        //toggle isLogin to opposite of previous one
        setIsLogin(prevMode => !prevMode);
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className='authentication'>
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>{isLogin ? 'LOGIN' : 'SIGN UP'}</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLogin && (
                        <Input 
                            element='input'
                            id='name'
                            type='text'
                            label='Name'
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText='Please enter a name.'
                            onInput={inputHandler}
                        />
                    )}
                    {!isLogin && <ImageUpload center id='image' onInput={inputHandler} errorText='Please provide an image' />}
                    <Input 
                        id='email' 
                        element='input'
                        type='email'
                        label='E-mail'
                        validators={[VALIDATOR_EMAIL()]}
                        errorText='Please enter a valid e-mail address.'
                        onInput={inputHandler}
                    />
                    <Input 
                        id='password' 
                        element='input'
                        type='password'
                        label='Password'
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText='Please enter a valid password.'
                        onInput={inputHandler}
                    />
                    <Button type='submit' disabled={!formState.isValid}>
                        {isLogin ? 'LOGIN' : 'SIGN UP'}
                    </Button>
                </form>
                {isLogin && <a href='#' onClick={loginTestUser}>Login with test user</a>}
                <br></br>
                <Button inverse onClick={switchModeHandler}>
                    SWITCH TO {isLogin ? 'SIGN UP' : 'LOGIN'}
                </Button>
            </Card>
        </React.Fragment>
    );
}

export default Auth;