import { useLocation, useParams } from "react-router";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import { useSocket } from "./providers/SocketProvider";
import Friends from "./Friends";
import Invite from "./Invite";
import styled from "styled-components";
import { Socket } from "socket.io-client";


function Profile(){
    const location = useLocation().pathname;
    const {id} = useParams();
    const [user, setUser] = useState()
    const navigate = useNavigate();
    const {currentUser} = useAuth();
    const [friendStatus, setFriendStatus] = useState();
    const socket = useSocket();

    useEffect(() => {
        fetchUser()
        areFriends();
    }, [location])

    async function fetchUser(){
        const uri = "http://localhost:5186"+location
        const res = await fetch(uri);
        const data = res.json();
        setUser(await data)
    }

    async function areFriends(){
        const uri = "http://localhost:5186/getFriendship"
        const res = await fetch(uri, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                user1: currentUser.uid,
                user2: id
            })
        });
        const data = await res.json()
        console.log(data);
        setFriendStatus(data.status)
    }
    function inviteFriend(){
        socket.emit('send-invite', id);
    }

    function removeFriend(){
        const uri = "http://localhost:5186/removeFriend"
        fetch(uri, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user1:currentUser.uid,
                user2: id
            })
        })    
        setFriendStatus("")
    }

    function addFriend(){
        const uri = "http://localhost:5186/addFriend"
        fetch(uri, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user1:currentUser.uid,
                user2: id
            })
        })    
        setFriendStatus("pending")
    }


    const options = (
        <>
            {friendStatus != "pending" ? <AddButton onClick={() => addFriend()}>Add</AddButton> : <AddButton onClick={() => removeFriend()}>Remove</AddButton>}
            <AddButton onClick={() => inviteFriend()}>Invite To Game</AddButton>
            <AddButton>Send Message</AddButton>  
        </> 
    )

    const profile = () => {
        if(user == null) return <h1>Loading...</h1>
        return(
            
        <>  


         


     
        <Card>
        <Title>{user.Username}</Title>
        <Title>({user.Elo})</Title>
           <SideButtonGroup>         
            {currentUser.uid != id && options}
            <AddButton onClick={()=>navigate("friends")}>View Friends</AddButton>     
            </SideButtonGroup>
            
        </Card>

        <div>{friendStatus}</div>
        </>
        )
    }
    
    return(
        <>
           {user && profile()}
        </>
    )
    
}


const Title = styled.div`
background:white;
color: black;
padding: 0.2em;
font-size:5em;

`

const Card = styled.div`
position:relative;
display:flex;
justify-content: space-even;
border: 0.25em solid black;
width:75vw;
color:black;
padding: 2em; 
box-shadow: 8px 6px 0px 0px #000000;
`

const CardItem = styled.div`
font-size: 2em;
margin: 1em 0em;
`

const AddButton2 = styled.div`
cursor:pointer;
text-align:right;
align-self:flex-end;
`

const AddButton = styled.button`
position:relative;
font-size: 1.2em;
width:100%;
background: white;
border: none;
text-align: right;
text-overflow:clip;
// margin-left: 1.5em;
align-self: flex-end;
transition:color 0.2s;
cursor:pointer;
z-index:1;
&:hover{
color:whitesmoke;
}

&:before{
content: "";
position: absolute;
background: rgba(0,0,0,1);
bottom: 0;
left: 100%;
right: 0;
top: 0;
z-index: -1;
transition: left 0.09s ease-in;
}

&:hover:before{
left:0;
}
`
const SideButtonGroup = styled.div`
position:absolute;
display:flex;
flex-direction:column;
top:0;
height:100%;
right: 0%;
justify-content:space-between;
`

export default Profile