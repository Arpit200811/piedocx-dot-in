import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { base_url, UI_URL } from '../utils/info';

function AdminPanel() {
  const [student, setStudent] = useState({
    name: '',
    registration: '',
    college: '',
    branch: '',
    year: '',
    technology: '',
    startDate: '',
    endDate: ''
  });

  const [generatedId, setGeneratedId] = useState('');

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${base_url}/api/students`, student);
      setGeneratedId(res.data?.student?._id);
    } catch (err) {
      if (err.response?.status === 409) {
        alert('❌ This registration number is already registered!');
      } else {
        console.error('Error creating student:', err.message);
        alert('⚠️ Failed to create student. Check the backend server.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Add Student & Generate QR</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(student).map(([key, val]) => (
            <input
              key={key}
              name={key}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={val}
              onChange={handleChange}
              required
              pattern={key === 'registration' ? '[A-Za-z]{5}[0-9]{6}' : undefined}
              title={key === 'registration' ? '5 letters followed by 6 digits (e.g., ABCDE123456)' : ''}
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}

          <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
            >
              🚀 Generate QR
            </button>
          </div>
        </form>

        {generatedId && (
          <div className="mt-10 text-center">
            <h4 className="text-xl font-semibold text-gray-700 mb-4">📲 Scan QR to View Info</h4>
            <div className="inline-block bg-white p-4 rounded-lg shadow-lg">
              <QRCode value={`${UI_URL}/#/student/${generatedId}`} size={180} />
            </div>
            <p className="mt-4 text-sm text-gray-600">
              🔗 URL: <code className="bg-gray-100 p-1 rounded">{`/student/${generatedId}`}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
