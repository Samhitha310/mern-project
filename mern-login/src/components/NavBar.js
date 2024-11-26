// src/NavBar.js
import React from 'react';
import './NavBar.css';
import logo from './images/dealsdray.png'; // Import the image file

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="DealsDray" className="navbar-logo" />
      </div>
      {/* No logout button */}
    </nav>
  );
};

export default NavBar;
