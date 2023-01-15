import React, { useContext, useEffect,useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useSocket } from "./SocketProvider";
import { useAuth } from "../context/AuthContext";

const GameContext = React.createContext();

export function useGame() {
    return useContext(GameContext);
}

function GameWrapper({children}){
    const socket = useSocket()
    const [invite, setInvite] = useState({});
    const [colour, setColour] = useState();
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    function newInvite(res){
        setInvite({player: res.player})
    }

    function accpetInvite(){
        setInvite({});
        socket.emit('accept-invite',invite)
    }

    async function getCurrentGame(){
        const response = await fetch("http://localhost:5186/getCurrentGame/"+currentUser.uid)
        return await response.text();
    }
    
    const test = (
        <>
            <p>You have been invited to a game by </p> {invite.player} 
            <p>Click here to</p>  <button onClick={accpetInvite}>Join</button> 
        </>
    )
        
    const value = {
        getCurrentGame
    }

    useEffect(()=>{
        if(socket == null) return
        
        socket.on('recieve-invite', (res)=>{
            console.log("you have received an invite")
            newInvite(res)
        })


        socket.on('start-game', (res) => {
            getCurrentGame().then((game)=>
            {
                navigate("/game/"+game);
            })
        });

    },[socket])

    return(
        <GameContext.Provider value = {value}>  
            {colour && colour}
            { invite.player !=null && test}
            {children}
        </GameContext.Provider>
    )
}

export default GameWrapper;