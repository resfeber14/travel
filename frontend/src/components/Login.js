import { Cancel, Room } from '@material-ui/icons'
import React, { useState ,useRef} from 'react'
import axios from 'axios'
import "./login.css"

function Login({setShowLogin,myStorage,setCurrUser}) {
    const [error,setError]=useState(false);
    const nameRef=useRef();
    const passwordRef=useRef();
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const user={
            username:nameRef.current.value,
            password:passwordRef.current.value
        };
        try{
            const res=await axios.post("/users/login",user);
            myStorage.setItem("user",res.data.username)
            setCurrUser(res.data.username)
            setShowLogin(false)
            setError(false);
        }
        catch(err){
            setError(true);
        }
    }
    return (
        <div className="loginContainer">
            <div className="logo">
                <Room/>
                TravelwithUs
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" ref={nameRef}></input>
                <input type="password" placeholder="password" ref={passwordRef}></input>
                <button className="btn-login" type="submit">Login</button>
                {error && <span className="failure">Something went wrong</span>}
                
            </form>
            <Cancel className="cancel" onClick={()=>setShowLogin(false)}/>
        </div>
    )
}

export default Login
