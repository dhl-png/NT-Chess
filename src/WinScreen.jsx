import styled from "styled-components"
import { useEffect, useRef, useState } from "react"
import { useSocket } from "./providers/SocketProvider";
import { useUser } from "./providers/UserProvider";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";

function WinScreen({winner,id,eloChange}){
    const socket = useSocket();
    const {fetchUser} = useUser();
    const [active, setActive]= useState(true);
    const navigate = useNavigate();

    function rematch(){
       socket.emit('rematch', "test");
    }
    
    function hide(){
        setActive(false)
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
        active && winner != null &&
        <Card>
           <ExitButton onClick={hide}>X</ExitButton>
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
`
const ExitButton = styled.div`
    border:none;
    display:flex;
    flex-direction:column;
    align-self:flex-end;
    align-items:center;
    justify-contet:center;
    font-weight: 800;
    font-size: clamp(1.5em,10vw,3em);  
    aspect-ratio:1;
    color:white;
    text-align: center;
    padding: 0.5em;
    background:black;
    cursor:pointer;
`


const Card = styled.div`
    display: flex;
    align-items:center;
    justify-content:space-between;
    flex-direction: column;
    border: solid black 0.5em;
    position:absolute;
    align-content: flex-end;
    width:75vw;
    height: clamp(30em,20em,20vw);
    max-width: 100em;
    top: 50%;
    right: 50%;
    transform: translate(50%, -55%);
    z-index: 1;
    background:white;
    color:black;
    box-shadow: 8px 6px 0px 0px #000000;
    font-size:0.8em;
`


const Button = styled.button`
margin: 0em 2em;
margin-bottom: 2vw;
cursor: pointer;

font-weight: 600;
border: solid black 0.5em;
background:white;
padding: 1vw;
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