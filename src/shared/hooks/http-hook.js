//custom hook to perform http requests
import { useState, useCallback, useRef, useEffect } from 'react';

//custom hook that send http request and manage loading and error state
export const useHttpClient = () => {
    //isLoading state
    const [isLoading, setIsLoading] = useState(false);
    //error state
    const [error, setError] = useState();

    //use a ref to create an array of active http requests
    const activeHttpRequests = useRef([]);

    //function that sends request (useCallback because its called in a useEffect hook)
    const sendRequest = useCallback(async (url, method = 'GET', requestBody = null, headers = {}) => {
        //setIsLoading is true
        setIsLoading(true);
        //create new abort controller and add it to array of active http requests
        const httpAbortController = new AbortController();
        activeHttpRequests.current.push(httpAbortController);
        //try to send an http request
        try {
            //send http request and get response
            const response = await fetch(url, {
                method: method,
                body: requestBody,
                headers: headers,
                signal: httpAbortController.signal
            });
            //parse response data to JSON
            const responseData = await response.json();

            //filter controler used in this request out
            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortController
            );

            //if response data comes with a 400/500 status code
            if(!response.ok){
                throw new Error(responseData.message);
            }

            //setIsLoading is false
            setIsLoading(false);

            //if reponse is good, return it
            return responseData;
        } catch (err) {
            //set error to error message
            setError(err.message);

            //setIsLoading is false
            setIsLoading(false);

            //throw error
            throw err;
        }
    }, []);

    //function to clear error state
    const clearError = () => {
        setError(null);
    };

    //when component unmounts, abort all controllers
    useEffect(() => {
        //cleanup function(when component unmounts)
        return () => {
            //abort all abort controllers in the active http requests array
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
        };
    }, []);

    //return isLoading, error, sendRequest, and clearError
    return {isLoading: isLoading, error: error, sendRequest: sendRequest, clearError: clearError};
};