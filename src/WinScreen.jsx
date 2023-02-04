import styled from "styled-components"
import { useState } from "react"
import { useSocket } from "./providers/SocketProvider";
import { useUser } from "./providers/UserProvider";

function WinScreen({winner,id}){
    const [active, setActive] = useState(true);
    const socket = useSocket();
    const {fetchUser} = useUser();
    function rematch(){
        //TODO() Not implemented;
    }

    function newGame(){
        socket.emit('join-queue', id);
        navigate("/home")
    }

    return(
        active &&
        <Card onClick={() => setActive(true1)}>
            <ExitButton>X</ExitButton>
            <h1>{winner}</h1>
            <h1>Elo Gain and los</h1>
            <ButtonContainer>
                <Button>Play again</Button>
                <Button>Remtach</Button>
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