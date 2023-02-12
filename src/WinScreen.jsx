import styled from "styled-components"
import { useEffect, useRef, useState } from "react"
import { useSocket } from "./providers/SocketProvider";
import { useUser } from "./providers/UserProvider";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";

function WinScreen({winner,id,eloChange}){
    const socket = useSocket();
    const {fetchUser} = useUser();
    const navigate = useNavigate();

    function rematch(){
       socket.emit('rematch', "test");
    }

    async function newGame(){
        const res = await fetchUser(id);
        const user = await res.json();
        console.log(user)
        const json = JSON.stringify({id: user.Id, elo:user.Elo});
        socket.emit('join-queue', json);
        navigate("/home")
    }
    function addPlusSymbol(eloChange){
        if (eloChange > 0 ) return `+${eloChange}`
        return eloChange
    }

    return(
        winner != null &&
        <Card>
            <h1>{winner} won</h1>
            <h1>{addPlusSymbol(eloChange)}</h1>
            <ButtonContainer>
                <Button onClick ={newGame}>Play again</Button>
                <Button onClick={rematch}>Remtach</Button>
            </ButtonContainer>
        </Card>
    )
}


const ButtonContainer = styled.div`
margin-top: 80%;

`
const ExitButton = styled.button`
    border:none;
    align-self:right;
    justify-self:right;
    align-content:right;
`
const Card = styled.div`
    display: flex;
    flex-direction: column;
    border: solid black 0.5em;
    position:absolute;
    justify-content:center;
    align-items:center;
    align-content: flex-end;
    height: clamp(60vh, 40vw, 60vw);
    width: clamp(35vh, 35vw, 40vw);
    top: 50%;
    right: 50%;
    transform: translate(50%, -55%);
    z-index: 1;
    background:white;
    color:black;
    box-shadow: 8px 6px 0px 0px #000000;
`


const Button = styled.button`
margin: 0em 2em;
margin-bottom: 2vw;
cursor: pointer;

font-weight: 600;
border: solid black 0.5em;
background:white;
padding: 1.5vw;
&:nth-child(even){
    background:black;
    color:white;
}
&:hover{ 
    color:white;
    background:black;
    border: solid white 0.5em;    
}
&:nth-child(even):hover{
    color:black;
    background:white;
    border: solid black 0.5em;   
}

`

export default WinScreen