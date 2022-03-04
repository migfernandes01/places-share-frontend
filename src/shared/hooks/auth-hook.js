import { useState, useCallback, useEffect } from 'react';


//timer for auto logout
let logoutTimer;

//custom hook
export const useAuth = () => {
    //token state
  const [token, setToken] = useState(false);
  //tokenExpirationDate state
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  //userId state
  const [userId, setUserId] = useState();

  //callback function to set token and userId
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    //get expiration date from params or generate an expiration date from 2 days from login
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 48);
    //set token expiration date state
    setTokenExpirationDate(tokenExpirationDate);
    //stringify object and store it into localStorage under userData
    localStorage.setItem('userData', JSON.stringify({
      userId: uid, 
      token: token, 
      expiration: tokenExpirationDate.toISOString()
    }));

    setUserId(uid);
  },[]);

  //callback function to set token and userId to null
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    //remove userData from localStorage
    localStorage.removeItem('userData');
  },[]);

  //run if token changes
  useEffect(() => {
    //if token AND token expiration date are valid
    if(token && tokenExpirationDate){
      //set remaining time to expiration - current time of execution
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      //execute logout when the we reach remaining time
      logoutTimer = setTimeout(logout, remainingTime);
    }else{  //if token ot expiration date are invalid
      //clear logoutTimer
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  //run when component is mounted(app refreshes)
  useEffect(() => {
    //check userData in localStorage and parse it to JSON
    const storedData = JSON.parse(localStorage.getItem('userData'));
    //if we found it on localStorage and expiration date is in the future
    if(storedData && storedData.token && new Date(storedData.expiration) > new Date()){
      //call login passing the existing and valid id, token and expiration date
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  //return data needed in App component
  return { token, userId, login, logout };
}