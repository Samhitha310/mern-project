import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook to navigate after login

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure Content-Type is set to application/json
        },
        body: JSON.stringify({
          username: username,  // Ensure username and password are being passed correctly
          password: password,
        }),
      });

      const data = await response.json();
      console.log(data.message);

      if (data.message === 'Login successful') {
        localStorage.setItem('username', username);
        alert(data.message);  // Display success message
        navigate('/subnav');  // Navigate to the subnav page
      } else {
        alert(data.message || 'Server error');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during login');
    }
  };

  return (
    <div className="login-page">
      <NavBar />
      <div className="login-container">
  <div className="login-header">
    <h2>Login Page</h2>
  </div>
  <div className="login-form-container">
    <form onSubmit={handleSubmit} className="login-form">
      <div className="input-field">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="input-field">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="submit-btn">Submit</button>
    </form>
  </div>
</div>
</div>
  );
};

export default Login;
