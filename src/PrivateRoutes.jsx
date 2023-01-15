import { useAuth } from "./context/AuthContext";
import { Outlet,Navigate } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
function PrivateRoutes(){
    const {currentUser} = useAuth();

    return(
        currentUser ? 
        <Outlet />
        :
        <Login/>
    )

}

export default PrivateRoutes