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
            getPlayerName(data.player).then((name) =>{
                console.log(name)
                setPlayer({id:data.player, name:name})
                setActive(true)
            })
        }) 
    }, [socket])
    
    function acceptInvite(){
        socket.emit('accept-invite', player.id);
        setActive(false);
    }
    async function getPlayerName(player){
        const resp = await fetch("https://nt-chess2.up.railway.app/user/"+player)
        const data = await resp.json()
        const username = await data.Username;
        return await username
    }

    return (
        
        active ?
        <Inv> 
            <Message> You have been invited to play by {player.name} </Message>
            <ButtonContainer>
                <Button onClick={() => acceptInvite()} >Accept</Button>
                <Button onClick={() => setActive(false)}>Decline</Button>
            </ButtonContainer> 

            </Inv>
     : 
        <Inv>
        </Inv>
    ) 
}

const Container = styled.div`
    position: absolute;
`
    
const Inv = styled.div`
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    align-self: flex-end;
    border: 0.2em solid black;
    margin-right: 2em;
    margin-bottom:2em;
    @media(orientation: portrait){
        align-self: center;
        margin-right: 0;
        margin-bottom:2em;
        max-width :90vw;
    }

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