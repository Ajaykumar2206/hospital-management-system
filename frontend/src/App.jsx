// frontend/src/App.jsx
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import BookAppointment from './pages/BookAppointment';
import MedicalHistory from './pages/MedicalHistory';
import Appointments from './pages/Appointments';
import DoctorAppointments from './pages/DoctorAppointments';
import PatientDetails from './pages/PatientDetails';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppContent() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        
        <Route 
          path="/" 
          element={
            user ? (
              user.role === 'patient' ? <Navigate to="/patient/dashboard" /> : <Navigate to="/doctor/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        {/* Patient Routes */}
        <Route
          path="/patient/dashboard"
          element={
            <PrivateRoute role="patient">
              <PatientDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/book-appointment"
          element={
            <PrivateRoute role="patient">
              <BookAppointment />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/medical-history"
          element={
            <PrivateRoute role="patient">
              <MedicalHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <PrivateRoute role="patient">
              <Appointments />
            </PrivateRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <PrivateRoute role="doctor">
              <DoctorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <PrivateRoute role="doctor">
              <DoctorAppointments />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor/patient/:patientId"
          element={
            <PrivateRoute role="doctor">
              <PatientDetails />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;