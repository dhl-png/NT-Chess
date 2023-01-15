import { updateCurrentUser } from "firebase/auth";
import { useState, useRef } from "react";
import { isRouteErrorResponse, useNavigate } from "react-router";
import styled from "styled-components";
import { useAuth } from "./context/AuthContext";

function Search(){
    const [users, setUsers] = useState([]);
    const searchRef = useRef();
    const {currentUser} = useAuth();
    const navigate = useNavigate()

    const Title = styled.h1`
        align-self: flex-start;
        font-size:8em;
        padding: 0em 0.2em;
    `

    async function searchUsers(qry){
        const uri = "http://localhost:5186/search?"
        const res = await fetch(
            uri + new URLSearchParams({qry: qry}))
        const data = await res.json()
        setUsers(data)
    }
    
    function submit(){
        const searchQry = searchRef.current.value;
        searchUsers(searchQry);
    }

    const Input = styled.input`
        width: 75vw;
        height: 3vh;

    `


    const Table = styled.table`
        width: 75vw;
        border-collapse: collapse;
        border: solid black 1px;
    `
    
    const Tr = styled.tr`
        cursor: pointer;

        &:hover{
            background: black;
            color:white;
        }
    `
    const Th = styled.th`
        font-size: 2em;
        text-align:left;
        padding-bottom: 1em;
    `
    const Td = styled.td`
        font-size: 2em;
        padding: 0.5em 0em;
    `
    const table = (
        <Table>
            <thead>
                <Th>Name</Th>
                <Th>Elo</Th>
            </thead>
            { users.map((user) => { 
                if(user.Id == currentUser.uid) return
                return(
                
                <Tr onClick={() => navigate("/user/"+user.Id)}>
                    <Td>{user.Username}</Td>
                    <Td>{user.Elo}</Td>
                </Tr>
            )
            })
            }
        </Table>
    ) 


    const Button = styled.button`
        border: 1px solid black;
        color: white;
        background: black;
        height: 3vh;
    `
    
    return(
        <>
        <Title>Search</Title>
        <div>
            <Input ref={searchRef}/>    <Button onClick={submit}>Search</Button>
        </div>
     
        <div>
            {table}
        </div>
        </>
    )
}


export default Search