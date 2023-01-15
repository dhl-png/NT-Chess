import { useLocation, useParams } from "react-router";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import Friends from "./Friends";
import Invite from "./Invite";
import styled from "styled-components";


function Profile(){
    const location = useLocation().pathname;
    const {id} = useParams();
    const [user, setUser] = useState()
    const navigate = useNavigate();
    const {currentUser} = useAuth();
    const [friendStatus, setFriendStatus] = useState();

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

    const Title = styled.div`
        position:absolute;
        background:white;
        top:-30%;
        left:5%;
        bottom:100%;
        font-size:5em;
    `
    const Card = styled.div`
        position:relative;
        border: 0.3em solid black;
        width:75vw;
        hieght:75vh;
    `

    const CardItem = styled.div`
        font-size: 2em;
        margin: 1em 0em;
    `

    const AddButton = styled.div`
        cursor:pointer;
        text-align:right;
        align-self:flex-end;
    `
    
    const SideButtonGroup = styled.div`
        position:absolute;
        display:flex;
        flex-direction:column;
        top:0;
        height:100%;
        right: 1%;
        justify-content:space-evenly;
    `

    const options = (
        <>
            {friendStatus != "pending" ? <AddButton onClick={() => addFriend()}>Add</AddButton> : <AddButton onClick={() => removeFriend()}>Remove</AddButton>}
            <AddButton>Invite To Game</AddButton>
            <AddButton>Send Message</AddButton>  
        </> 
    )

    const profile = () => {
        if(user == null) return <h1>Loading...</h1>
        return(
            
        <>
    
        <Card>
        <Title>{user.Username}</Title>
           <CardItem>ELO: {user.Elo}</CardItem> 
           <CardItem>W/L: Games Won</CardItem> 
           <SideButtonGroup>         
            {currentUser.uid != id && options}
            <AddButton>View Friends</AddButton>     
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

export default Profile