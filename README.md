# 🏥 Hospital Management System

A comprehensive full-stack hospital management system built with the MERN stack (MongoDB, Express.js, React, Node.js) and styled with Tailwind CSS.

![Hospital Management System](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Node.js-16+-339933?logo=node.js)

## 📸 Screenshots

### Login & Registration
<div align="center">
  <img src="./images/login.png" alt="Login Page" width="45%" />
  <img src="./images/register.png" alt="Register Page" width="45%" />
</div>

### Patient Portal
<div align="center">
  <img src="./images/patient-dashboard.png" alt="Patient Dashboard" width="45%" />
  <img src="./images/book-appointment.png" alt="Book Appointment" width="45%" />
</div>

### Doctor Portal
<div align="center">
  <img src="./images/doctor-dashboard.png" alt="Doctor Dashboard" width="45%" />
  <img src="./images/appointments.png" alt="Appointments Management" width="45%" />
</div>

## 🌟 Features

### 👨‍⚕️ Doctor Portal
- **Separate Login Interface** - Dedicated authentication for medical professionals
- **Appointment Management** - View and manage scheduled patient appointments
- **Patient Records Access** - View medical history of patients with active appointments (privacy-protected)
- **Diagnosis & Prescriptions** - Add, modify, and update patient diagnoses and prescriptions
- **Smart Scheduling** - System prevents appointment conflicts during doctor's busy hours and breaks
- **Dashboard Analytics** - Overview of scheduled, completed, and total appointments

### 👤 Patient Portal
- **Separate Login Interface** - Secure patient authentication
- **Book Appointments** - Schedule appointments with available doctors
- **View Available Slots** - Real-time availability based on doctor schedules
- **Manage Appointments** - View, update, or cancel existing appointments
- **Medical History Management** - Add and update personal medical information
- **Privacy Protection** - Medical records only accessible to doctors with active appointments
- **View Diagnoses** - Access complete diagnosis and prescription history
- **No Appointment Conflicts** - System ensures unique time slots per patient

### 🔒 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Privacy-protected medical records
- Secure API endpoints

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM library
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing

## 📁 Project Structure

```
hospital-management-system/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema (doctors & patients)
│   │   ├── Appointment.js       # Appointment schema
│   │   └── MedicalHistory.js    # Medical history schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── patient.js           # Patient-specific routes
│   │   ├── doctor.js            # Doctor-specific routes
│   │   └── appointment.js       # Appointment management routes
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── server.js                # Express server setup
│   ├── package.json
│   ├── vercel.json              # Vercel deployment config
│   └── .env                     # Environment variables
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── BookAppointment.jsx
│   │   │   ├── Appointments.jsx
│   │   │   ├── MedicalHistory.jsx
│   │   │   ├── DoctorAppointments.jsx
│   │   │   └── PatientDetails.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── config/
│   │   │   └── api.js           # API configuration
│   │   ├── App.jsx              # Main app component
│   │   ├── index.jsx            # Entry point
│   │   └── index.css            # Global styles
│   ├── package.json
│   ├── tailwind.config.js       # Tailwind configuration
│   └── .env.production          # Production environment variables
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Git

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/hospital-management-system.git
cd hospital-management-system
```

#### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to `.env`:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
```

#### 3. Setup Frontend

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file (for local development)
echo "REACT_APP_API_URL=http://localhost:5000" > .env
```

### Running the Application

#### Start Backend Server
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

#### Start Frontend Development Server
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

### First Time Setup

1. **Register a Doctor**
   - Go to http://localhost:3000/register
   - Select "Doctor"
   - Fill in details including specialization
   - Default schedule: Monday-Friday, 9 AM - 5 PM

2. **Register a Patient**
   - Go to http://localhost:3000/register
   - Select "Patient"
   - Complete registration

3. **Book an Appointment**
   - Login as patient
   - Navigate to "Book Appointment"
   - Select doctor, date, and available time slot
   - Add reason for visit

4. **Manage as Doctor**
   - Login as doctor
   - View appointments
   - Access patient history
   - Add diagnosis and prescriptions

## 🌐 Deployment

### Deploy to Vercel

#### Backend Deployment

1. Install Vercel CLI
```bash
npm install -g vercel
```

2. Deploy Backend
```bash
cd backend
vercel login
vercel
```

3. Add Environment Variables on Vercel Dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

4. Deploy to production
```bash
vercel --prod
```

#### Frontend Deployment

1. Create `.env.production` in frontend folder
```env
REACT_APP_API_URL=https://your-backend.vercel.app
```

2. Deploy Frontend
```bash
cd frontend
vercel
vercel --prod
```

3. Update backend CORS with frontend URL

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist IP: 0.0.0.0/0 (for Vercel)
4. Get connection string
5. Add to environment variables

## 📖 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient",
  "phone": "1234567890",
  "age": 30,
  "gender": "male"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"
}
```

### Patient Endpoints

All patient endpoints require authentication token in header:
```
Authorization: Bearer <token>
```

- `GET /api/patient/profile` - Get patient profile
- `GET /api/patient/medical-history` - Get medical history
- `PUT /api/patient/medical-history` - Update medical history
- `GET /api/patient/appointments` - Get all appointments

### Doctor Endpoints

- `GET /api/doctor/profile` - Get doctor profile
- `GET /api/doctor/appointments` - Get all appointments
- `GET /api/doctor/patient/:patientId/history` - Get patient history
- `PUT /api/doctor/appointment/:appointmentId` - Update appointment with diagnosis

### Appointment Endpoints

- `GET /api/appointment/doctors` - Get all doctors
- `GET /api/appointment/slots/:doctorId/:date` - Get available slots
- `POST /api/appointment/book` - Book appointment
- `PUT /api/appointment/:appointmentId` - Update appointment
- `DELETE /api/appointment/:appointmentId` - Cancel appointment

## 🎨 Design Features

- **Modern UI** - Clean, professional interface with gradient backgrounds
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Smooth Animations** - Hover effects and transitions for better UX
- **Accessible** - High contrast, clear labels, and keyboard navigation
- **Role-Based UI** - Distinct interfaces for patients and doctors
- **Loading States** - Visual feedback during API calls
- **Error Handling** - User-friendly error messages

## 🔐 Security Best Practices

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with expiration (7 days)
- Role-based access control
- Protected routes on frontend and backend
- Environment variables for sensitive data
- CORS configuration for specific origins
- Input validation and sanitization

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend.vercel.app
```

## 🐛 Known Issues & Solutions

### CORS Errors
- Ensure `FRONTEND_URL` is set in backend environment
- Check CORS configuration in `server.js`

### MongoDB Connection Issues
- Verify connection string format
- Whitelist IP address in MongoDB Atlas
- Check network access settings

### Appointment Slots Not Showing
- Ensure doctor has schedule configured
- Check doctor's schedule array in database
- Verify date format in API calls

## 🚧 Future Enhancements

- [ ] Email notifications for appointments
- [ ] SMS reminders
- [ ] Video consultation feature
- [ ] Payment integration
- [ ] Prescription printing
- [ ] Admin dashboard
- [ ] Advanced analytics and reports
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Mobile application

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: https://github.com/Ajaykumar2206
- LinkedIn: https://www.linkedin.com/in/ajay-kumar-raju/


## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Vercel for deployment platform
- Tailwind CSS for styling framework
- React community for excellent documentation


---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**