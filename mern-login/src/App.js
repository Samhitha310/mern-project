// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import SubNav from './components/SubNav';
import CreateEmployee from './components/CreateEmployee';
import EmployeeList from './components/EmployeeList';
import EmployeeEdit from './components/EmployeeEdit';


function App () {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/subnav" element={<SubNav />} />
        <Route path="/create-employee" element={<CreateEmployee />} />
        <Route path="/employee-list" element={<EmployeeList />} />
        <Route path="/edit-employee/:id" element={<EmployeeEdit />} />
      </Routes>
    </Router>
  );
};

export default App;
