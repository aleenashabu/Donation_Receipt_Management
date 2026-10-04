import { useState } from "react";
import Register from "./Register";

function Login() 
{
    const [email, setEmail] = useState('')
    const[password,setPassword]=useState('')
    const[showRegister,setShowRegister]=useState(false);
    const handleLogin=()=>{

         if (email === "") {
    alert("Please enter your email");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address");
    return;
  }

  if (password === "") {
    alert("Please enter your password");
    return;
  }

  alert("Login form is valid");
        
    }
    if(showRegister){
        return <Register/>;
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
            <p>Don't have an account?{" "}
                <a href="#" onClick={()=>setShowRegister(true)}>Register</a></p>
        </div>
        </div>
    )
} 
    export default Login