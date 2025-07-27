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
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-white px-4 py-10">
      <div
        className="w-full max-w-xl bg-white shadow-2xl rounded-3xl p-8"
        data-aos="zoom-in"
      >
        <h2
          className="text-3xl font-bold text-center text-blue-600 mb-6 font-sans"
          data-aos="fade-down"
        >
          🎓 Student Information
        </h2>

        <ul className="space-y-4 text-lg text-gray-800" data-aos="fade-up" data-aos-delay="200">
          <li className="flex justify-between border-b pb-2">
            <span>👤 <strong>Name:</strong></span>
            <span>{student.name}</span>
          </li>
           <li className="flex justify-between border-b pb-2">
            <span>👤 <strong>Registration-No:</strong></span>
            <span>{student.registration}</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span>🏫 <strong>College:</strong></span>
            <span>{student.college}</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span>📚 <strong>Branch:</strong></span>
            <span>{student.branch}</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span>📅 <strong>Year:</strong></span>
            <span>{student.year}</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span>💻 <strong>Technology:</strong></span>
            <span>{student.technology}</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span>🚀 <strong>Start Date:</strong></span>
            <span>{student.startDate}</span>
          </li>
          <li className="flex justify-between">
            <span>🏁 <strong>End Date:</strong></span>
            <span>{student.endDate}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default StudentDetails;
