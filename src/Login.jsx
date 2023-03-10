import { useRef } from "react"
import { useAuth } from "./context/AuthContext"
import { useState } from "react"
import { useNavigate,Link } from "react-router-dom"
import styled from "styled-components"

function Login(){
    const [error, setError] = useState()
    const emailRef = useRef()
    const passwordRef = useRef()
    const {login} = useAuth() 
    const navigate = useNavigate()

    async function submit(e){
        e.preventDefault()
        const email = emailRef.current.value
        const password = passwordRef.current.value

        try{
            setError("")
            await login(email,password).then((res)=>{
                console.log(res)
                navigate("/home")
            })
        } catch {
            setError("Failed to log in")
        }

    }
    return(
        
        <Container>
            <H1>Login</H1>   
            {error}
            <div>                
                <Label>Username</Label>
                <Input ref={emailRef}/>
            </div>
            <div>
                <Label> Password</Label>
                <Input type="password" ref={passwordRef}/>
            </div>
            <Button onClick={submit}>Log in</Button>
            <div>
                <Link to ={"/signup"}>Dont have an account?</Link>
            </div>
        </Container>
    )
}

export default Login

const Container = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: solid black 1em;
    padding: 2em;
`
const H1 = styled.h1`
    font-size: 5em;
    text-align: center;
`
const Label = styled.label`
    display:block;
    padding: 0;
    margin-bottom: -1em;
`
const Input = styled.input`
    border-radius: 0px;
    border: solid black 0.6em;
    padding: 1em 1em 1em 0;
    margin: 1.5em;
`

const Button = styled.button`
justify-self:flex-end;
cursor: pointer;
font-weight: 600;
border:none;
border: 0.4em solid black;
width:100%;
background:black;
color:white;
padding:1em;
transition: 0.1s ease;

&:hover{
    background:white;
    color:black;
}
`