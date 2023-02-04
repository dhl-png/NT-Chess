import React, { useContext} from "react"
const UserContext = React.createContext()

export function useUser(){
    return useContext(UserContext);
}

export function UserProvider({children}){

    async function fetchUser(id){
        const newUser = await fetch("/user/"+currentUser.uid);
        return newUser;
    }

    const value = {
        fetchUser
    }

    return (
        <UserContext.Provider value={value}> 
            {children}
        </UserContext.Provider>
    )
}