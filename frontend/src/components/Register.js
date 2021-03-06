import { Cancel, Room } from '@material-ui/icons'
import React, { useState ,useRef} from 'react'
import axios from 'axios'
import "./register.css"

function Register({setShowRegister}) {
    const [success,setSuccess]=useState(false);
    const [error,setError]=useState(false);
    const nameRef=useRef();
    const emailRef=useRef();
    const passwordRef=useRef();
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const newUser={
            username:nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value
        };
        try{
            const res=await axios.post("/users/register",newUser);
            setError(false);
            setSuccess(true);
        }
        catch(err){
            setError(true);
        }
    }
    return (
        <div className="registerContainer">
            <div className="logo">
                <Room/>
                TravelwithUs
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" ref={nameRef}></input>
                <input type="email" placeholder="email" ref={emailRef}></input>
                <input type="password" placeholder="password" ref={passwordRef}></input>
                <button className="btn-register" type="submit">Register</button>
                {success && <span className="success">Successful.You can login now</span>}
                {error && <span className="failure">Something went wrong</span>}
                
            </form>
            <Cancel className="cancel" onClick={()=>setShowRegister(false)}/>
        </div>
    )
}

export default Register
