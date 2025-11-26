// frontend/src/pages/PatientDetails.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const PatientDetails = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatientData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      const response = await axios.get(`/api/doctor/patient/${patientId}/history`);
      setPatient(response.data.patient);
      setHistory(response.data.history);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading patient data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Patient Details</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
          <Link to="/doctor/appointments" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Appointments
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Patient Details</h1>
          <Link to="/doctor/appointments" className="text-blue-600 hover:underline">
            Back to Appointments
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium text-gray-900">{patient?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{patient?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{patient?.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Age</p>
              <p className="font-medium text-gray-900">{patient?.age || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-medium text-gray-900">{patient?.gender || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Blood Group</p>
              <p className="font-medium text-gray-900">{history?.bloodGroup || 'Not specified'}</p>
            </div>
          </div>
          {patient?.address && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium text-gray-900">{patient.address}</p>
            </div>
          )}
        </div>

        {/* Medical History */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Medical History</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Allergies</h3>
              {history?.allergies?.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700">
                  {history.allergies.map((allergy, index) => (
                    <li key={index}>{allergy}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No allergies recorded</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Chronic Conditions</h3>
              {history?.chronicConditions?.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700">
                  {history.chronicConditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No chronic conditions recorded</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Current Medications</h3>
              {history?.medications?.length > 0 ? (
                <div className="space-y-2">
                  {history.medications.map((med, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-gray-600">
                        Dosage: {med.dosage} | Frequency: {med.frequency}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No medications recorded</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Past Surgeries</h3>
              {history?.pastSurgeries?.length > 0 ? (
                <div className="space-y-2">
                  {history.pastSurgeries.map((surgery, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">{surgery.name}</p>
                      <p className="text-sm text-gray-600">
                        Date: {surgery.date ? new Date(surgery.date).toLocaleDateString() : 'Not specified'}
                      </p>
                      {surgery.notes && (
                        <p className="text-sm text-gray-600">Notes: {surgery.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No past surgeries recorded</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Family History</h3>
              <p className="text-gray-700">
                {history?.familyHistory || 'Not specified'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
              <p className="text-gray-700">
                {history?.notes || 'No additional notes'}
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <p className="text-sm text-blue-800">
            <strong>Privacy Notice:</strong> This medical information is confidential and is only accessible because you have an appointment with this patient.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PatientDetails;