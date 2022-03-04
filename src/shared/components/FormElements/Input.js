//Input component
import React, { useReducer, useEffect } from 'react';

import './Input.css';   //CSS style

import { validate } from '../../util/validators';   //external funtion to validate input 

//reducer function
const inputReducer = (state, action) => {
    switch (action.type){
        case 'CHANGE':
            return {
                ...state,           //spread old state
                value: action.val,  //set value to the current value
                isValid: validate(action.val, action.validators),      //run logic to figure out the validity
            };
        case 'TOUCH': 
            return {
                ...state,
                isTouched: true,
            };
        default:
            return state;
    }
};

function Input(props) {
    //reducer to manage state(passing reducer function and initial state)
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.value || '', 
        isValid: props.isValid || false, 
        isTouched: false,
    });

    //extract id and onInput from props
    const{id, onInput} = props;
    //extract value and isValid from inputState
    const {value, isValid} = inputState;

    //runs when id, value, isValid or onInput changes
    useEffect(() => {
        onInput(id, value, isValid);
    }, [id, value, isValid, onInput]);

    //function to handle change in the input
    const changeHandler = (event) => {
        //dispatch new action to reducer funtion with type of change and val of the e.targetvalue
        dispatch({type: 'CHANGE', val: event.target.value, validators: props.validators});
    };

    //function to handle infput firld touch
    const touchHandler = () => {
        dispatch({type: 'TOUCH'});
    }

    //constant that either gets an input or a textarea
    const element = props.element === 'input' ? (
        <input id={props.id} type={props.type} placeholder={props.placeholder} onChange={changeHandler} onBlur={touchHandler} value={inputState.value} />
    ) : (
        <textarea id={props.id} rows={props.rows || 3} onChange={changeHandler} onBlur={touchHandler} value={inputState.value} />
    );

    return (
        <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
        </div>
    );
}

export default Input;