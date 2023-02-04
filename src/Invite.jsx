import styled from "styled-components"
import { useSocket } from "./providers/SocketProvider"
import { useState,useEffect } from "react";

function Invite({user}) {
    const socket = useSocket();
    const [active, setActive] = useState(false);
    const [player, setPlayer] = useState();

    useEffect(() => {
        if(socket == null) return
        socket.on('recieve-invite', (data)=>{
            console.log(data.player)
            setPlayer(data.player)
            setActive(true)
        }) 
    }, [socket])
    
    function acceptInvite(){
        socket.emit('accept-invite', player);
        setActive(false);
    }

    return (
        active ?
        <Inv> 
            <Message> You have been invited to play by {player} </Message>
            <ButtonContainer>
                <Button onClick={() => acceptInvite()} >Accept</Button>
                <Button onClick={() => setActive(false)}>Decline</Button>
            </ButtonContainer> 
        </Inv> : 
        
        <Inv>
        </Inv>
    ) 
}


    
const Inv = styled.div`
display: flex;
flex-direction: column;
align-content: flex-end;
align-self: flex-end;
border: 0.2em solid black;
margin: 5vw;
`
const Button = styled.button`
justify-self:flex-end;
cursor: pointer;
font-weight: 600;
border:none;
border-top: 0.2em solid black;
width:100%;
background:white;
padding:1em;
&:nth-child(even){
    background:black;
    color:white;
}
`
const Message = styled.div`
padding: 1em;
`

const ButtonContainer = styled.div`
display:flex;
margin-top: 10%;
justify-content:space-between;
`


export default Invite