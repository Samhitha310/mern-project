# mern-project
# Employee Management System

This is an Employee Management System built using **React** for the front-end, **Node.js** with **Express** for the back-end, and **MongoDB** for the database. The application allows users to manage employee data, including adding, viewing, and editing employee information.

## Features

1. **Login**
   ![Screenshot (1)](https://github.com/user-attachments/assets/4a602b44-f8ea-44fb-8640-1e1ecd275e9d)

   - The system requires users to log in to access employee management features.
   - Login credentials are validated through the back-end, and the session is maintained using `localStorage`.
   - Upon successful login, users are redirected to the employee list page.
   - Users can log out, which clears the session and redirects them to the login page.
   - ![Screenshot (2)](https://github.com/user-attachments/assets/c912fb23-b939-4c1d-b438-518abf75723e)

2. **Employee List**
 ![Screenshot (3)](https://github.com/user-attachments/assets/f39ae726-5e88-4761-956c-ea45f42c6d5c)

   - The employee list page displays all employees in the database.
   - Each employee entry includes basic information such as name, email, mobile number, designation, and gender.
   - An "Edit" button is provided next to each employee for modifying their details.
   - Users can filter the employees by designation, gender, or course.
   - ![Screenshot (4)](https://github.com/user-attachments/assets/e09eb84c-1139-43fc-abe6-5d995c4f0c2e)


3. **Employee Edit**
   ![Screenshot (5)](https://github.com/user-attachments/assets/01c5d526-a889-4385-a134-e1b0fcb20bc7)

   - The employee edit page allows users to update the details of a selected employee.
   - The form is pre-filled with the current data of the employee, which can be modified.
   - Employees can be updated with new values for name, email, mobile number, designation, gender, and course.
   - The form also includes an option to upload a new profile image.
   - Changes are submitted to the back-end through an API call, and the employee details are updated in the database.
