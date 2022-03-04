//context API for authentication
import { createContext } from "react";  //createContext

//create context with initial data
export const AuthContext = createContext({
    isLoggedIn: false,
    userId: null,
    token: null, 
    login: () => {}, 
    logout: () => {} 
});