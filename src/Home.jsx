import { useEffect,useState } from "react"
import { useAuth } from "./context/AuthContext"
import { useNavigate } from "react-router"
import { useGame } from "./providers/GameWrapper"
import { useSocket } from "./providers/SocketProvider"
import styled from "styled-components"
import king from './wking.png'
function Home(){
    const {currentUser, logout} = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState()
    const {getCurrentGame} = useGame();
    const socket = useSocket();

    async function signout(){
        try {
            setError("")
            await logout()
        } catch {
            setError("Could not log out")
        }
    }
    
    async function joinGame(){
        const gameID = await getCurrentGame()
        if (gameID == -1) {
            socket.emit('join-queue', JSON.stringify({id: currentUser.uid, elo:100}));
        } else {
            socket.emit('join-game', game);
        }
    }
    const Title = styled.h1`
        align-self: flex-start;
        font-size:8em;
        padding: 0.1em 0.2em;
    `
    const ButtonGroup = styled.div`
        display:flex;
        align-self:flex-start;
        align-items:flex-start;    
        flex-direction: column;
    `
    const Button = styled.button`
        position:relative;
        font-size:1.2em;
        width:100%;
        background: white;
        border: none;
        text-align: left;
        text-overflow:clip;
        margin-left: 1.5em;
        line-height: 0.5em;
        transition:color 0.2s;
        cursor:pointer;
        z-index:1;
        overflow:hidden;

        &:hover{
            color:whitesmoke;
        }
        
        &:before{
            content: "";
            position: absolute;
            background: rgba(0,0,0,1);
            bottom: 0;
            left: 0;
            right: 100%;
            top: 0;
            z-index: -1;
            transition: right 0.09s ease-in;
        }

        &:hover:before{
            right:0;
        }
    `
    
    
    return(
        <>
          <ButtonGroup>
            <Title>NT-Chess</Title>
          
            <Button onClick={() => navigate("/game/3")}>
                <h3>New Game</h3>
            </Button>
            <Button>
                <h3>Invite a Friend</h3>
            </Button>
            <Button onClick={() => navigate("/user/"+currentUser.uid)}>
                <h3>Offline</h3>
            </Button>
            <Button>
                <h3>About</h3>
            </Button>
            </ButtonGroup>
        </>
    )
}

export default Home