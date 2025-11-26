import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();
// createContext can help us create a context that components can provide or read
// Context lets the parent component make some information available to any component in the tree 
// below it—no matter how deep—without passing it explicitly through props.

// Soo when the user logs in, we are gng to use his token and userID & store it in the localStorage
// soo that when user wants to access the protected routes than AuthContext provides a check 
// to see if the user has access to the token

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);

    // Everytime a component loads than we call this useEffect to check the user
    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if(userId)
        {
            setCurrentUser(userId);
        }
    }, []);

    const value = {
        currentUser, setCurrentUser
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
