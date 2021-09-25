// Third party components
import { createContext } from 'react'



// Application wide umbrella State type of object that any components can read from   
export const AuthContext = createContext({ 
    isLoggedIn: false, // Property 
    userId: null, // Property
    login: () => {},  // Method
    logout: () => {}  // Method
})