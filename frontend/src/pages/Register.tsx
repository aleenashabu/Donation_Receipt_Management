import {useState} from "react";

function Register(){
const [name,setName]=useState('');
const [email,setEmail]=useState('');
const [password,setPassword]=useState('');
const [confirmPassword,setConfirmPassword]=useState('');

const handleRegister = async () => {
    if (name === "") {
      alert("Please enter your name");
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

    if (confirmPassword === "") {
      alert("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
  const response = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.message || "Registration failed");
    return;
  }

  alert("Registration successful!");
} catch (error) {
  alert("Unable to connect to the server");
}

  };

return(
    <>
    <div className="login-page">
        <div className="login-card">
            <h1>Register</h1>
            <p>Create Your Account</p>
            <label>Name:</label>
            <input type="text" placeholder="Enter your name" value={name}
          onChange={(e) => setName(e.target.value)}/>
            <label>Email:</label>
            <input type="email" placeholder="Enter your email"  value={email}
          onChange={(e) => setEmail(e.target.value)}/>
            <label>Password:</label>
            <input type="password" placeholder="Enter your password" value={password}
          onChange={(e) => setPassword(e.target.value)}/>
            <label>Confirm Password:</label>
            <input type="password" placeholder="Confirm your password" value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}/>
            <button onClick={handleRegister}>Register</button>
        </div>
    </div>
    </>
)
}
export default Register