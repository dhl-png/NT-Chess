import React, {useContext, useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";
const SocketContext = React.createContext();

export function useSocket(){
    return useContext(SocketContext)
}

export function SocketProvider({id, children}){
    const [socket, setSocket] = useState()

    useEffect(() => {
        const newSocket = io('http://52.65.178.242:8080', 
        { query: {id} })
        setSocket(newSocket)
        return () => newSocket.close()
    },[id])

    
    return(
        <SocketContext.Provider value ={socket}>
            {children}
        </SocketContext.Provider>
    )
}