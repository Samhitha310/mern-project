import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './dashboard.css';
import CreateEmployee from './CreateEmployee';

function Dashboard() {
  const [showCreateEmployee] = useState(false);
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
    <div className="dashboard-container">
      <NavBar/>
      <div className="subnav">
        <ul className="nav-links">
          <li>
            <a href="/" className="home">
              Home
            </a>
          </li>
          <li>
            <a href="/employee-list" className="employee-list-link">
              Employee List
            </a>
          </li>
          <li>
            <a href="/employee-list" className="employee-name">
              {user}
            </a>
          </li>
          <li>
            <a href="/" className="logout" onClick={handleLogout}>
              Logout
            </a>
          </li>
        </ul>
      </div>
      {showCreateEmployee ? (
        // Render CreateEmployee when showCreateEmployee is true
        <div>
          <CreateEmployee />
        </div>
      ) : (
        // Render Dashboard content when showCreateEmployee is false
        <div>
          <h2 className="dashboard-title">Dashboard</h2>
          <div className="welcome-center">
          <button
          className="create-employee-btn"
          onClick={() => navigate('/create-employee')}
        >
          Welcome Admin Panel
        </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
