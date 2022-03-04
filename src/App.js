import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'; //Browser router, Route

//Pages
//import Users from './user/pages/Users';               //users 
//import NewPlace from './places/pages/NewPlace';       //new place
//import UserPlaces from './places/pages/UserPlaces';   //user places
//import UpdatePlace from './places/pages/UpdatePlace'; //Update place
//import Auth from './user/pages/Auth';                 //Auth

//Components
import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

//Context API
import { AuthContext } from './shared/context/auth-context';

import { useAuth } from './shared/hooks/auth-hook';   //custom hook

// Lazy loading
const Users = React.lazy(() => import ('./user/pages/Users'));
const NewPlace = React.lazy(() => import ('./places/pages/NewPlace'));
const UserPlaces = React.lazy(() => import ('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import ('./places/pages/UpdatePlace'));
const Auth = React.lazy(() => import ('./user/pages/Auth'));

function App() {
  //useAuth custom hook
  const {token, userId, login, logout } = useAuth();

  //set routes according to wheater the user is logged in or not
  let routes;
  //if there is a token (user is logged in)
  if(token){
    routes = (
      <Switch>
        <Route path='/' exact>
          <Users />
        </Route>
        <Route path='/:userId/places' exact>
          <UserPlaces />
        </Route>
        <Route path='/places/new' exact>
          <NewPlace />
        </Route>
        <Route path='/places/:placeId'>
          <UpdatePlace />
        </Route>
        <Redirect to='/' />
      </Switch>
    );
  }else{  //if user is not logged in
    routes = (
      <Switch>
        <Route path='/' exact>
          <Users />
        </Route>
        <Route path='/:userId/places' exact>
          <UserPlaces />
        </Route>
        <Route path='/auth'>
          <Auth />
        </Route>
        <Redirect to='/auth' />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider value={{isLoggedIn: !!token, token: token, userId:userId, login: login, logout: logout}}>
      <Router>
        <MainNavigation />
        <main>
          <Suspense fallback={<div className='center'><LoadingSpinner /></div>}>
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
