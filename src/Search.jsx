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
        const uri = "http://nt-chess-db-production.up.railway.app:80/search?"
        const res = await fetch(
            uri + new URLSearchParams({qry: qry}))
        const data = await res.json()
        setUsers(data)
    }
    
    function submit(e){
        e.preventDefault()
        const searchQry = searchRef.current.value;
        searchUsers(searchQry);
    }

    const Input = styled.input`
        width: 75vw;
        height: 3vh;
        border: solid black 0.7em;
        box-shadow: 8px 6px 0px 0px #000000;
        margin: 0em 0em;
    `


    const Table = styled.table`
        margin-top: 10em;
        width: 60vw;
        border-collapse: collapse;
        border: solid black 0.7em;
        box-shadow: 8px 6px 0px 0px #000000;
        
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
        padding: 0.5em 0.5em;
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
        font-weight: 600;
        color: white;
        align-self:flex-end;
        font-size:2em;
        width: 6em;
        background: black;
        box-shadow: 8px 6px 0px 0px #000000;
    `
    
    return(
        <Container>
        <form onSubmit={submit}>
        <Input ref={searchRef}/>   
        </form>
        <Button onClick={submit}>Search</Button>
     
        <div>
            {table}
        </div>
        </Container>
    )
}

const Container = styled.div`
    display:flex;
    flex-direction: column;
    
`

export default Search