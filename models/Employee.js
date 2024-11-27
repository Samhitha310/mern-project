const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobileNo: { type: String, required: true },
  designation: { type: String, required: true },
  gender: { type: String, required: true },
  course: { type: [String], required: true },
  image: { type: String },
  createDate: { type: Date, default: Date.now },  // Automatically set to current date
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
