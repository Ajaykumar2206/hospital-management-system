// frontend/src/pages/MedicalHistory.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MedicalHistory = () => {
  const [history, setHistory] = useState({
    bloodGroup: '',
    allergies: [],
    chronicConditions: [],
    pastSurgeries: [],
    medications: [],
    familyHistory: '',
    notes: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Temporary input states
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  // const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '' });
  // const [newSurgery, setNewSurgery] = useState({ name: '', date: '', notes: '' });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/patient/medical-history');
      if (response.data) {
        setHistory(response.data);
      }
    } catch (err) {
      setError('Failed to load medical history');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.put('/api/patient/medical-history', history);
      setSuccess('Medical history updated successfully');
      setIsEditing(false);
      fetchHistory();
    } catch (err) {
      setError('Failed to update medical history');
    }
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setHistory({ ...history, allergies: [...history.allergies, newAllergy.trim()] });
      setNewAllergy('');
    }
  };

  const removeAllergy = (index) => {
    setHistory({ ...history, allergies: history.allergies.filter((_, i) => i !== index) });
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setHistory({ ...history, chronicConditions: [...history.chronicConditions, newCondition.trim()] });
      setNewCondition('');
    }
  };

  const removeCondition = (index) => {
    setHistory({ ...history, chronicConditions: history.chronicConditions.filter((_, i) => i !== index) });
  };

  // const addMedication = () => {
  //   if (newMedication.name.trim()) {
  //     setHistory({ ...history, medications: [...history.medications, { ...newMedication }] });
  //     setNewMedication({ name: '', dosage: '', frequency: '' });
  //   }
  // };

  // const removeMedication = (index) => {
  //   setHistory({ ...history, medications: history.medications.filter((_, i) => i !== index) });
  // };

  // const addSurgery = () => {
  //   if (newSurgery.name.trim()) {
  //     setHistory({ ...history, pastSurgeries: [...history.pastSurgeries, { ...newSurgery }] });
  //     setNewSurgery({ name: '', date: '', notes: '' });
  //   }
  // };

  // const removeSurgery = (index) => {
  //   setHistory({ ...history, pastSurgeries: history.pastSurgeries.filter((_, i) => i !== index) });
  // };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Medical History</h1>
          <Link to="/patient/dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {!isEditing ? (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Edit History
                </button>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Blood Group</h3>
                <p className="text-gray-700">{history.bloodGroup || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Allergies</h3>
                {history.allergies?.length > 0 ? (
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
                {history.chronicConditions?.length > 0 ? (
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
                {history.medications?.length > 0 ? (
                  <div className="space-y-2">
                    {history.medications.map((med, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-gray-600">Dosage: {med.dosage} | Frequency: {med.frequency}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No medications recorded</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Past Surgeries</h3>
                {history.pastSurgeries?.length > 0 ? (
                  <div className="space-y-2">
                    {history.pastSurgeries.map((surgery, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">{surgery.name}</p>
                        <p className="text-sm text-gray-600">Date: {surgery.date ? new Date(surgery.date).toLocaleDateString() : 'Not specified'}</p>
                        {surgery.notes && <p className="text-sm text-gray-600">Notes: {surgery.notes}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No past surgeries recorded</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Family History</h3>
                <p className="text-gray-700">{history.familyHistory || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
                <p className="text-gray-700">{history.notes || 'No additional notes'}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                <input
                  type="text"
                  value={history.bloodGroup}
                  onChange={(e) => setHistory({ ...history, bloodGroup: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., A+, B-, O+"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Add allergy"
                  />
                  <button type="button" onClick={addAllergy} className="bg-green-600 text-white px-4 py-2 rounded-lg">
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {history.allergies?.map((allergy, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                      <span>{allergy}</span>
                      <button type="button" onClick={() => removeAllergy(index)} className="text-red-600">×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Conditions</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Add condition"
                  />
                  <button type="button" onClick={addCondition} className="bg-green-600 text-white px-4 py-2 rounded-lg">
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {history.chronicConditions?.map((condition, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                      <span>{condition}</span>
                      <button type="button" onClick={() => removeCondition(index)} className="text-red-600">×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Family History</label>
                <textarea
                  value={history.familyHistory}
                  onChange={(e) => setHistory({ ...history, familyHistory: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Any relevant family medical history"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  value={history.notes}
                  onChange={(e) => setHistory({ ...history, notes: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Any other medical information"
                ></textarea>
              </div>

              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
              {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">{success}</div>}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    fetchHistory();
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default MedicalHistory;