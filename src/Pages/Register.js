import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import '../App.css';

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    localStorage.removeItem('token')
  }, [])

  async function registerUser(event) {
    event.preventDefault()

    const response = await fetch('http://localhost:4000/api/register', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })

    const data = await response.json()

    if (data.status === 'ok') {
      navigate('/')
    }
  }

  function navigateLogin() {
    navigate('/')
  }

  return (
    <div class="userInfo">
      <h1>Register</h1>
      <form onSubmit={registerUser}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Username"
        /><br />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Email"
        /><br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        /><br />
        <input type="submit" value="Register" class="submit"/>
        <button type="navigator" class="loginNav" onClick={navigateLogin}>Go to Login</button>
      </form>
    </div>
  );
}

export default Register;
