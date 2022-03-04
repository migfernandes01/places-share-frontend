//Users page
import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';                                //UsersList component
import ErrorModal from '../../shared/components/UIElements/ErrorModal';         //ErrorModal component
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'; //LoadingSpinner component

import { useHttpClient } from '../../shared/hooks/http-hook'; //useHttpClient custom hook

function Users() {
  //loadedUsers state
  const [loadedUsers, setLoadedUsers] = useState(false);
  
  //use custom httpClient hook
  const { isLoading, error, sendRequest, clearError} = useHttpClient();

  //run when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      //try to send an http request
      try {
        //get responseData from sendRequest function in custom hook
        const reponseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users');

        //set loaded users
        setLoadedUsers(reponseData.users);
      } catch (error) {
        //empty because we handle error state on the custom hook
      }
    };

    //call fetchUsers function
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <h1 style={{textAlign: 'center', color: 'white'}}>USERS:</h1>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers}/>}
    </React.Fragment>
  );
}

export default Users;