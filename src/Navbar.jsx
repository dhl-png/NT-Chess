import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

function Navbar() {
    const navigate = useNavigate()
    const {currentUser, logout} = useAuth()
    return(
        <Nav>
            <Spacer/>
            <NavItem onClick={() => navigate("/home")}>Home</NavItem>
            <NavItem onClick={() => navigate("/user/"+currentUser.uid)}>Profile</NavItem>
            <NavItem onClick={() => navigate("/Search")}>Search</NavItem>
            <NavItem onClick={() => logout()}>Log Out</NavItem>
        </Nav>
    )
}


const Nav = styled.div`
padding:0em;
display: flex;
width: 100vw;
height: 10vh;
justify-content: space-around;
align-items:center;
`
const NavTitle = styled.div`
font-size:2em;
padding:0.6em;
color:blue;
`

const NavItem = styled.div`
    cursor: hand;
    display:flex;    
    position:relative;
    font-size:1.2em;
    color:black;
    cursor:pointer;
    text-overflow:clip;
    align-items: center;
    z-index:1;

    &:before{
        content: "";
        position:absolute;
        width:0%;
        bottom:0;
        left:50%;
        transform: translate(-50% , 100%);
        border-bottom: 0.2em solid black;
        z-index: -1;
        transition: width 0.09s ease-in;

    }

    &:hover:before{
        width:100%;
    }

`
const Spacer = styled.div`
    width: 50%;
`


export default Navbar