import { useAuth } from "./context/AuthContext"
import { SocketProvider } from "./providers/SocketProvider"
import GameWrapper from "./providers/GameWrapper"
import { Outlet, Route } from "react-router-dom"
import Navbar from "./Navbar.jsx"
import Invite from "./Invite"
import { UserProvider } from "./providers/UserProvider"

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

export default OnlineWrapper