import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { base_url } from '../utils/info';

function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const fetchStudent = async () => {
      const res = await axios.get(`${base_url}/api/students/${id}`, { withCredentials: true });
      setStudent(res.data);
    };
    fetchStudent();
  }, [id]);

  if (!student) return <p className="text-center text-lg mt-10">⏳ Loading student details...</p>;

  return (
    <div className="container mt-4">
      <h2>Student Information</h2>
      <ul className="list-group">
        <li className="list-group-item"><strong>Name:</strong> {student.name}</li>
        <li className="list-group-item"><strong>College:</strong> {student.college}</li>
        <li className="list-group-item"><strong>Branch:</strong> {student.branch}</li>
        <li className="list-group-item"><strong>Year:</strong> {student.year}</li>
        <li className="list-group-item"><strong>Technology:</strong> {student.technology}</li>
        <li className="list-group-item"><strong>Start Date:</strong> {student.startDate}</li>
        <li className="list-group-item"><strong>End Date:</strong> {student.endDate}</li>
      </ul>
    </div>
  );
}

export default StudentDetails;
