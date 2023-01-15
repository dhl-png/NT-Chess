import { useRef } from "react"
import { useAuth } from "./context/AuthContext"
import { useState } from "react"
import { useNavigate,Link } from "react-router-dom"

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
        <div>   
            {error}
            <div>                
                <input ref={emailRef}/>
            </div>
            <div>
                <input type="password" ref={passwordRef}/>
            </div>
            <button onClick={submit}>Log in</button>
            <div>
                <Link to ={"/signup"}>Dont have an account?</Link>
            </div>
        </div>
    )
}

export default Login
