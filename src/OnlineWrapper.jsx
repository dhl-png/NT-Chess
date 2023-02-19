import { useAuth } from "./context/AuthContext"
import { SocketProvider } from "./providers/SocketProvider"
import GameWrapper from "./providers/GameWrapper"
import { Outlet, Route } from "react-router-dom"
import Navbar from "./Navbar.jsx"
import Invite from "./Invite"
import { UserProvider } from "./providers/UserProvider"
import styled from "styled-components"

function OnlineWrapper(){
    const {currentUser} = useAuth()

    return(
        <SocketProvider id ={currentUser.uid}>
           <GameWrapper>
            <UserProvider>
                    <Navbar />
                    <Outlet />
                    <Invite />
                  
                </UserProvider>
            </GameWrapper>
        </SocketProvider>
    )
}

const Container = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
`

export default OnlineWrapper