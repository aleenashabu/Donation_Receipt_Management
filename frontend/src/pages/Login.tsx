import { useState } from "react";

function Login() 
{
    const [email, setEmail] = useState('')
    const[password,setPassword]=useState('')
    const handleLogin=()=>{
        
    }

    return(
        <div className="login-page">
        <div className="login-card">
            <h1>Login</h1>
            <p>Sign into your Account</p>
            <label>Email:</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <label>Password:</label>
            <input type="password" placeholder="Enter password" value={password} onChange={(e) =>setPassword(e.target.value)}/>
            <button onClick={handleLogin}>Login</button>
        </div>
        </div>
    )
    }
    export default Login