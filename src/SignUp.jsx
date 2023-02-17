import { useRef } from "react"
import { useAuth } from "./context/AuthContext"
import { useState } from "react"
import { useNavigate,Link } from "react-router-dom"
import styled from "styled-components"

function SignUp(){
    const [error, setError] = useState()
    const emailRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const usernameRef = useRef();

    const {signup} = useAuth() 
    const navigate = useNavigate()

    async function submit(e){
        e.preventDefault()

        const username = usernameRef.current.value
        const email = emailRef.current.value
        const password = passwordRef.current.value
        const confirmPassword = confirmPasswordRef.current.value

        if(password != confirmPassword) return setError("Passwords do not match")

        try{
            setError("")
            await signup(email,password).then((res)=>{
                const id = res.user.uid
                newUser(id,username)
                navigate("/home")
            })
        } catch {
            setError("Failed to log in")
        }


    }

    async function newUser(id,username){
        const user = fetch("https://nt-chess-db-production.up.railway.app:80/newUser", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;'},
            body: JSON.stringify({
                Id: id,
                Username: username,
                Elo: 800,
            })
        })
        return await user

    }
    return(
        
        <Container>
            <h2>{error}</h2>
            <H1>Sign Up</H1>   

            <div>                
                <Label>Username</Label>
                <Input ref={usernameRef}/>
            </div>
               <div>                
                <Label>Email</Label>
                <Input ref={emailRef}/>
            </div>
            <div>
                <Label> Password</Label>
                <Input type="password" ref={passwordRef}/>
            </div>
            <div>
                <Label>Confirm Password</Label>
                <Input type="password" ref={confirmPasswordRef}/>
            </div>
            <Button onClick={submit}>Sign Up</Button>
            <div>
                <Link to ={"/login"}>Already have an account?</Link>
            </div>
        </Container>
    )
}

export default SignUp

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