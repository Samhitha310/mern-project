import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import NavBar from './NavBar';
import './EmployeeList.css';


function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);
  const location = useLocation();
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Fetch employees from the server
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5001/employees');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
    
        // Validate and handle missing fields
        const employeesWithNormalizedIds = data.map((employee) => ({
          _id: employee._id || employee.id, // Use id if _id is not present
          name: employee.name || 'Unknown',
          email: employee.email || 'N/A',
          mobileNo: employee.mobileNo || 'N/A',
          designation: employee.designation || 'N/A',
          gender: employee.gender || 'N/A',
          course: employee.course || [],
          image: employee.image || '/path/to/default-placeholder.png',
        }));
        
        setEmployees(employeesWithNormalizedIds);
        setFilteredEmployees(employeesWithNormalizedIds);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    
    fetchEmployees();
  },  [location.state?.refresh]);
  

  // Handle search functionality
  useEffect(() => {
    const filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.mobileNo.includes(searchTerm)
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);
  

  // Get logged-in user from localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) setUser(loggedInUser);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      const filtered = employees.filter((employee) =>
        employee.name.toLowerCase().includes(term.toLowerCase()) ||
        employee.email.toLowerCase().includes(term.toLowerCase()) ||
        employee.mobileNo.includes(term)
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  };

  const handleEdit = (employee) => {
    const normalizedEmployee = {
      ...employee,
      _id: employee._id || employee.id, // Ensure _id exists
    };
    console.log('Employee being edited:', normalizedEmployee);
    navigate(`/edit-employee/${employee._id}`, { state: { employee } });


  };
  
  
  

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/employees/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`Failed to delete: ${response.statusText}`);
      setEmployees((prev) => prev.filter((employee) => employee._id !== id));
      alert('Employee deleted successfully!');
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee.');
    }
  };

  

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUser(null);
    navigate('/');
  };

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="employee-list">
      <NavBar />
      <div className="subnav">
        <ul className="nav-links">
          <li><a href="/" className="home">Home</a></li>
          <li><a href="/employee-list" className="employee-list-link">Employee List</a></li>
          <li><a href="/employee-list" className="employee-name">{user}</a></li>
          <li><a href="/" className="logout" onClick={handleLogout}>Logout</a></li>
        </ul>
      </div>

      <h2>Employee List</h2>
      <div className="top-bar">
        <div className="employee-count">
          Total Employees: {filteredEmployees.length}
        </div>
        <button
          className="create-employee-btn"
          onClick={() => navigate('/create-employee')}
        >
          Create Employee
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter Search Keyword"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button>Search</button>
      </div>

      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile No</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Courses</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee._id}</td>
              <td>
                <img
                  src={employee.image ? `http://localhost:5001/${employee.image}` : '/path/to/default-placeholder.png'}
                  alt={employee.name}
                  width="50"
                  height="50"
                />
              </td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.mobileNo}</td>
              <td>{employee.designation}</td>
              <td>{employee.gender}</td>
              <td>{employee.course.join(', ')}</td>
              <td>
                
                <button onClick={() => handleEdit(employee)}>Edit</button>
                <button onClick={() => handleDelete(employee._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        {[...Array(Math.ceil(filteredEmployees.length / employeesPerPage))].map((_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={currentPage === i  ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastEmployee >= filteredEmployees.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default EmployeeList;