import React, { useContext} from "react"
const UserContext = React.createContext()

export function useUser(){
    return useContext(UserContext);
}

export function UserProvider({children}){

    async function fetchUser(id){
        const newUser = fetch("https://nt-chess2.up.railway.app/user/"+id);
        return await newUser;
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