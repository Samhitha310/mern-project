import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import './CreateEmployee.css';

function CreateEmployee() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    designation: '',
    gender: '',
    course: [],
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [employeeCreated, setEmployeeCreated] = useState(false);
  const navigate = useNavigate();

  // Redirect to login page if not logged in
  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (!loggedInUser) {
      navigate('/login'); // Redirect to login if not logged in
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.mobileNo) {
      newErrors.mobileNo = 'Mobile No is required';
    } else if (!/^[0-9]+$/.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Mobile No must be numeric';
    }
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (formData.course.length === 0) newErrors.course = 'At least one course should be selected';
    if (formData.image && !['image/jpeg', 'image/png'].includes(formData.image.type)) {
      newErrors.image = 'Only jpg/png files are allowed';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prevState) => {
        const updatedCourses = checked
          ? [...prevState.course, value]
          : prevState.course.filter((course) => course !== value);
        return { ...prevState, course: updatedCourses };
      });
    } else if (type === 'file') {
      setFormData((prevState) => ({ ...prevState, image: e.target.files[0] }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('mobileNo', formData.mobileNo);
    formDataToSend.append('designation', formData.designation);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('course', JSON.stringify(formData.course));
  
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
  
    // Debugging: Log the FormData contents
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  
    try {
      const response = await fetch('http://localhost:5001/create-employee', {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Error response:', errorDetails);
        // Handle the specific error for duplicate email
        if (errorDetails.message === "Email already exists") {
          setErrors({ serverError: 'The email address is already in use. Please use a different email.' });
        } else {
          setErrors({ serverError: errorDetails.message || 'Failed to create employee.' });
        }
        throw new Error('Failed to create employee');
      }
  
      const result = await response.json();
      console.log('Employee created:', result);
  
      if (result.success) {
        setMessage('Employee created successfully');
        setFormData({
          name: '',
          email: '',
          mobileNo: '',
          designation: '',
          gender: '',
          course: [],
          image: null,
        });
        setEmployeeCreated(true);
      } else {
        setErrors({ serverError: result.message || 'Failed to create employee.' });
      }
    } catch (error) {
      console.error('Error during submission:', error);
      setErrors({ serverError: 'An unexpected error occurred!' });
    }
  };
  

  
  
  // Redirect to Employee List after successful employee creation
  useEffect(() => {
    if (employeeCreated) {
      navigate('/employee-list');
    }
  }, [employeeCreated, navigate]);

  // Handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('username');
    setUser(null);
    navigate('/'); // Redirect to login page after logout
  };


  return (
    <div className="create-employee">
      <NavBar />
      <div className="subnav">
        <ul className="nav-links">
          <li>
            <a href="/" className="home">Home</a>
          </li>
          <li>
            <a href="/employee-list" className="employee-list-link">Employee List</a>
          </li>
          <li>
            <a href="/employee-list" className="employee-name">{user}</a>
          </li>
          <li>
            <a href="/" className="logout" onClick={handleLogout}>Logout</a>
          </li>
        </ul>
      </div>
      <h2>Create Employee</h2>
      {message && <p className="success-message">{message}</p>}
      {errors.serverError && <p className="error-message">{errors.serverError}</p>}
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        {/* Mobile No */}
        <div className="form-group">
          <label>Mobile No:</label>
          <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} />
          {errors.mobileNo && <p className="error-message">{errors.mobileNo}</p>}
        </div>

        {/* Designation */}
        <div className="form-group">
          <label>Designation:</label>
          <select name="designation" value={formData.designation} onChange={handleChange}>
            <option value="">Select Designation</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
          {errors.designation && <p className="error-message">{errors.designation}</p>}
        </div>

        {/* Gender */}
        <div className="form-group">
          <label>Gender:</label>
          <div>
            <input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} /> Male
            <input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} /> Female
          </div>
          {errors.gender && <p className="error-message">{errors.gender}</p>}
        </div>

        {/* Course */}
        <div className="form-group">
          <label>Course:</label>
          <div>
            <input type="checkbox" name="course" value="MCA" checked={formData.course.includes("MCA")} onChange={handleChange} /> MCA
            <input type="checkbox" name="course" value="BCA" checked={formData.course.includes("BCA")} onChange={handleChange} /> BCA
            <input type="checkbox" name="course" value="BSC" checked={formData.course.includes("BSC")} onChange={handleChange} /> BSC
          </div>
        </div>

        {/* Upload Image */}
        <div className="form-group">
          <label>Upload Image:</label>
          <input type="file" name="image" onChange={handleChange} />
          {errors.image && <p className="error-message">{errors.image}</p>}
        </div>

        {/* Submit */}
        <button type="submit">Create Employee</button>
      </form>
    </div>
  );
}

export default CreateEmployee;
