import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import Dashboard from './dashboard';
import './NavBar.css';
import './SubNav.css';

function SubNav() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);
  
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('username'); // Clear username from localStorage
    setUser(null);
    navigate('/'); // Redirect to the login page
  };
  
  return (
    <div className="App">
      <Navbar />
      <div className="subnav">
        <ul className="nav-links">
          <li><a href="/" className="home">Home</a></li>
          {user && <li><a href="/employee-list" className="employee-list">Employee List</a></li>}
          {user && (
            <>
              <li><a href="/profile" className="employee-name">{user}</a></li>
              <li><a href="/" className="logout" onClick={handleLogout}>Logout</a></li>
            </>
          )}
        </ul>
      </div>

      {/* Dashboard */}
      <Dashboard />
    </div>
  );
}

export default SubNav;
