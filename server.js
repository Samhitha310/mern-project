const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const Employee = require('./models/Employee');
const User = require('./models/User'); 
const router = express.Router();

const app = express();
const uploadPath = './uploads/';

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log('Uploads directory created');
}

app.use(express.json());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


mongoose
  .connect('mongodb://localhost:27017/mernlogin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

  
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
      res.status(200).json({ message: 'Login successful', username });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.post("/process", (req, res) => {
  const rawData = req.body.data;
  console.log("Raw data received:", rawData);
  
  // Check if the rawData is a JSON string, or if it's a comma-separated string
  try {
      // Attempt to parse rawData as JSON first
      let parsedData;
      try {
          parsedData = JSON.parse(rawData);
      } catch (e) {
          // If parsing fails, split the rawData into an array
          parsedData = rawData.split(',');
      }

      console.log("Parsed data:", parsedData);
      res.status(200).send("Data processed successfully");
  } catch (error) {
      console.error("Failed to parse data:", error.message);
      res.status(400).send("Invalid data format");
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
const upload = multer({ storage: storage });

// Handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file && !req.file.mimetype.startsWith('image/')) {
    return res.status(400).json({ message: 'Only image files are allowed' });
  }
  res.status(200).send({ imageUrl: `/uploads/${req.file.filename}` });
});

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.post('/create-employee', upload.single('image'), async (req, res) => {
  const { name, email, mobileNo, designation, gender } = req.body;
  let course = req.body.course;

  if (typeof course === 'string') {
    course = JSON.parse(course);
  }

  console.log('Received Employee Data:', { name, email, mobileNo, designation, gender, course });

  const image = req.file ? `uploads/${req.file.filename}` : null;

  if (!name || !email || !mobileNo || !designation || !gender || !course.length) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const lastEmployee = await Employee.findOne().sort({ uniqueId: -1 }).limit(1);
    const newEmployee = new Employee({
      name,
      email,
      mobileNo,
      designation,
      gender,
      course,
      image,
      createDate: new Date(),
    });

    await newEmployee.save();
    res.status(201).json({ success: true, message: 'Employee created successfully' });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ success: false, message: 'Failed to create employee', error: error.message });
  }
});


// Fetch all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find(); // Find all employees
    res.json(employees);
  } catch (err) {
    console.log('Error fetching employees:', err);
    res.status(500).json({ message: 'Error fetching employees' });
  }
});



app.get('/employee/:id', async (req, res) => {
  
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });

    
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee' });
  }
});

app.put('/edit-employee/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const updatedData = {
    name: req.body.name,
    email: req.body.email,
    mobileNo: req.body.mobileNo,
    designation: req.body.designation,
    gender: req.body.gender,
    course: req.body.course ? JSON.parse(req.body.course) : [],
  };
  
  const imageFile = req.file;

  if (req.file) {
    updatedData.imagePath = `uploads/${req.file.filename}`;
  } else {
    const existingEmployee = await Employee.findById(id);
    if (existingEmployee) {
      updatedData.imagePath = existingEmployee.imagePath;
    }
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedEmployee) {
      return res.status(404).send({ message: 'Employee not found' });
    }
    res.send({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    res.status(500).send({ message: 'Error updating employee', error });
  }
});



app.get('/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id); // Assuming you're using MongoDB
    if (!employee) {
      return res.status(404).send({ message: 'Employee not found' });
    }
    res.send(employee);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching employee', error });
  }
});

// DELETE Employee Endpoint
app.delete('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ message: err.message });
  } else if (err) {
    res.status(400).json({ message: err.message });
  } else {
    next();
  }
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
