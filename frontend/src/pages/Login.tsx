import { useState } from "react";
import Register from "./Register";
import Dashboard from "./Dashboard";

type User = {
  id: number;
  name: string;
  email: string;
};

function Login() 
{
    const [email, setEmail] = useState('')
    const[password,setPassword]=useState('')
    const[showRegister,setShowRegister]=useState(false);
    const[showDashboard,setShowDashboard]=useState(false);
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    const resetLogin = () => {
    setEmail('');
    setPassword('');
    };

    const handleLogin = async () => {
  if (email.trim() === "") {
  alert("Please enter your email");
  return;
}

const emailPattern =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu)$/;

if (!emailPattern.test(email.trim())) {
  alert("Please enter a valid email address");
  return;
}

  if (password === "") {
    alert("Please enter your password");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();
    console.log("Login response:", data);

    // Wrong email or password
    if (!response.ok) {
      alert(data.message || "Invalid email or password");
      return;
    }

    // Correct email and password
  if (!data.user) {
    alert("User details were not returned by the backend.");
    return;
  }

  setLoggedInUser(data.user);
  setShowDashboard(true);

  } catch (error) {
    alert("Unable to connect to the server");
  }
};

if (showRegister) {
  return (<Register 
  onRegisterSuccess={()=> {
    resetLogin();
    setShowRegister(false)
  }}
   />
);
}

if (showDashboard && loggedInUser) {
  return (
    <Dashboard
      user={loggedInUser}
      onLogout={() => {
        resetLogin();
        setLoggedInUser(null);
        setShowDashboard(false);
      }}
    />
  );
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