import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate,useParams, Link } from 'react-router-dom';
import NavBar from './NavBar';
import './EmployeeEdit.css';


function EmployeeEdit() {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [employees, setEmployees] = useState([]);
  const { id } = useParams();
  const [updatedData, setUpdatedData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    designation: '',
    gender: '',
    course: [],
    imagePath: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Fetch employee data from API
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:5001/employees/${id}`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        console.log('Fetched data:', data);
  
        // Validate the data structure
        if (data && data._id) {
          setEmployee(data);
          setUpdatedData({
            name: data.name || '',
            email: data.email || '',
            mobileNo: data.mobileNo || '',
            designation: data.designation || '',
            gender: data.gender || '',
            course: data.course || [],
            imagePath: data.imagePath || '',
          });
          setImagePreview(data.imagePath || '');
        } else {
          throw new Error('Invalid employee data');
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
        alert('Employee not found. Redirecting to employee list.');
        navigate('/employee-list');
      }
    };
    fetchEmployee();
  }, [id, navigate]);
  
    

  // Scroll into view
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Only JPEG and PNG images are allowed.');
        return;
      }
      setImagePreview(URL.createObjectURL(file));
      setImage(file);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    // Simple validation for required fields
    if (!updatedData.name || !updatedData.email || !updatedData.mobileNo) {
      alert('Please fill in all required fields.');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', updatedData.name);
    formData.append('email', updatedData.email);
    formData.append('mobileNo', updatedData.mobileNo);
    formData.append('designation', updatedData.designation);
    formData.append('gender', updatedData.gender);
    formData.append('course', JSON.stringify(updatedData.course));
  
    if (image) {
      formData.append('image', image);
    }
  
    try {
      const response = await fetch(`http://localhost:5001/edit-employee/${id}`, {
        method: 'PUT',
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.message || 'Employee updated successfully');
        navigate('/employee-list');
      } else {
        alert(data.message || 'Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };
  

  // Handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('username');
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (!loggedInUser) navigate('/login');
    setUser(loggedInUser);
  }, [navigate]);

  if (!employee) return <div>Loading...</div>;

  return (
    <div>
      <NavBar />
      <div className="subnav">
        <ul className="nav-links">
          <li><Link to="/" className="home">Home</Link></li>
          {user && <li><Link to="/employee-list" className="employee-list">Employee List</Link></li>}
          {user && (
            <>
              <li><span className="employee-name">{user}</span></li>
              <li><a href="/" className="logout" onClick={handleLogout}>Logout</a></li>
            </>
          )}
        </ul>
      </div>
      <h2>Edit Employee</h2>
      <div ref={formRef} className="edit-form-container">
        <form onSubmit={handleUpdate}>
          {/* Input fields */}
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={updatedData.name}
            onChange={handleInputChange}
          />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={updatedData.email}
            onChange={handleInputChange}
          />
          <label>Mobile No:</label>
          <input
            type="text"
            name="mobileNo"
            value={updatedData.mobileNo}
            onChange={handleInputChange}
          />
          <label>Designation:</label>
          <select
            name="designation"
            value={updatedData.designation}
            onChange={handleInputChange}
          >
            <option value="HR">HR</option>
            <option value="MANAGER">MANAGER</option>
            <option value="SALES">SALES</option>
          </select>
          {/* Gender options */}
          <label>Gender:</label>
          <div className="gender-options">
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={updatedData.gender === 'Male'}
              onChange={handleInputChange}
            />
            Male
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={updatedData.gender === 'Female'}
              onChange={handleInputChange}
            />
            Female
          </div>
          {/* Courses */}
          <label>Course:</label>
          <div className="course-options">
            {['MCA', 'BCA', 'BSC'].map((course) => (
              <label key={course}>
                <input
                  type="checkbox"
                  value={course}
                  checked={updatedData.course.includes(course)}
                  onChange={(e) => {
                    const newCourses = e.target.checked
                      ? [...updatedData.course, course]
                      : updatedData.course.filter((c) => c !== course);
                    setUpdatedData({ ...updatedData, course: newCourses });
                  }}
                />
                {course}
              </label>
            ))}
          </div>
          {/* Profile Image */}
          <label>Profile Image:</label>
          <div>
    {/* Show preview before upload */}
    {imagePreview && !image && (
      <img src={imagePreview} alt="Profile Preview" width="100" />
    )}

    {/* Show uploaded image after saving */}
    {image && !imagePreview && (
      <img src={URL.createObjectURL(image)} alt="Profile" width="100" />
    )}

    <input type="file" onChange={handleImageChange} />
    {image && <img src={URL.createObjectURL(image)} alt="Preview" width="100" />}
  </div>
          {/* Submit Button */}
          <button type="submit">Update Employee</button>
        </form>
      </div>
    </div>
  );
}

export default EmployeeEdit;
