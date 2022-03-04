//useForm custom hook
import { useCallback, useReducer } from "react";

//reducer function
const formReducer = (state, action) => {
    switch(action.type){
        case 'INPUT_CHANGE':
            let formIsValid = true;
            for(const inputId in state.inputs){
                //if state.inputs for the current inputId is null/undefined
                if(!state.inputs[inputId]){
                    //continue to next for loop iteration
                    continue;
                }
                if(inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                }else{
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }
            return {
            ...state,
            inputs: {
                ...state.inputs,
                [action.inputId] : {value: action.value, isValid: action.isValid}
            },
            isValid: formIsValid,
            };
        case 'SET_DATA':
            return {
                inputs: action.inputs,
                isValid: action.formIsValid,
            };
        default:
            return state;
    }
};

//custom hook function
export const useForm = (initialInputs, initialFormValidity) => {
    //user reducer to manage state
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity,
    });

    //function to handle input change (useCallback so the function doesn't change(because its a dependency on Input component))
    const inputHandler = useCallback ((id, value, isValid) => {
        //dispatch new action to reducer
        dispatch({type: 'INPUT_CHANGE', value: value, isValid: isValid, inputId: id});
    }, []);

    //function that dispatched an action to set form data
    const setFormData = useCallback((inputData, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity,
        });
    }, []);

    //return formState, and inputHandler and setFormData functions
    return [formState, inputHandler, setFormData];
};