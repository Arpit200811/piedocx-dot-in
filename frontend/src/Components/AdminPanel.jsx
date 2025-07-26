import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { base_url, UI_URL } from '../utils/info';

function AdminPanel() {
  const [student, setStudent] = useState({
    name: '',
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

      setGeneratedId(res.data?.student?._id); // ✅ Correct path
    } catch (err) {
      console.error('Error creating student:',err.message);
      alert('Failed to create student. Check the backend server.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Student & Generate QR</h2>

      <form onSubmit={handleSubmit}>
        {Object.entries(student).map(([key, val]) => (
          <input
            key={key}
            name={key}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={val}
            onChange={handleChange}
            required
            className="form-control mb-2"
          />
        ))}

        <button type="submit" className="btn btn-primary">Generate QR</button>
      </form>

      {generatedId && (
        <div className="mt-4">
          <h4>Scan QR to View Info</h4>
          <QRCode value={`${UI_URL}/student/${generatedId}`} size={200} />
          <p className="mt-2">URL: <code>/student/{generatedId}</code></p>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
