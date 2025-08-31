// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import { base_url } from '../utils/info';

// function StudentDetails() {
//   const { id } = useParams();
//   const [student, setStudent] = useState(null);

//   useEffect(() => {
//     AOS.init({ duration: 1000, once: true });
//   }, []);

//   useEffect(() => {
//     const fetchStudent = async () => {
//       const res = await axios.get(`${base_url}/api/students/${id}`);
//       setStudent(res.data);
//     };
//     fetchStudent();
//   }, [id]);

//   if (!student) return <p className="text-center text-lg mt-10">⏳ Loading student details...</p>;

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-white px-4 py-10">
//       <div
//         className="w-full max-w-xl bg-white shadow-2xl rounded-3xl p-8"
//         data-aos="zoom-in"
//       >
//         <h2
//           className="text-3xl font-bold text-center text-blue-600 mb-6 font-sans"
//           data-aos="fade-down"
//         >
//           🎓 Student Information
//         </h2>

//         <ul className="space-y-4 text-lg text-gray-800" data-aos="fade-up" data-aos-delay="200">
//           <li className="flex justify-between border-b pb-2">
//             <span>👤 <strong>Name:</strong></span>
//             <span>{student.name}</span>
//           </li>
//            <li className="flex justify-between border-b pb-2">
//             <span>👤 <strong>Registration-No:</strong></span>
//             <span>{student.registration}</span>
//           </li>
//           <li className="flex justify-between border-b pb-2">
//             <span>🏫 <strong>College:</strong></span>
//             <span>{student.college}</span>
//           </li>
//           <li className="flex justify-between border-b pb-2">
//             <span>📚 <strong>Branch:</strong></span>
//             <span>{student.branch}</span>
//           </li>
//           <li className="flex justify-between border-b pb-2">
//             <span>📅 <strong>Year:</strong></span>
//             <span>{student.year}</span>
//           </li>
//           <li className="flex justify-between border-b pb-2">
//             <span>💻 <strong>Technology:</strong></span>
//             <span>{student.technology}</span>
//           </li>
//           <li className="flex justify-between border-b pb-2">
//             <span>🚀 <strong>Start Date:</strong></span>
//             <span>{student.startDate}</span>
//           </li>
//           <li className="flex justify-between">
//             <span>🏁 <strong>End Date:</strong></span>
//             <span>{student.endDate}</span>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default StudentDetails;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { base_url } from "../utils/info";
import Typewriter from "typewriter-effect";
import { FaHome } from "react-icons/fa";

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // ✅ Simplified data fetch
  useEffect(() => {
    const fetchStudent = async () => {
      const res = await axios.get(`${base_url}/api/students/${id}`);
      setStudent(res.data);
    };
    fetchStudent();
  }, [id]);

  // ✅ Simple Loading UI
  if (!student)
    return (
      <p className="text-center text-lg sm:text-xl font-semibold text-blue-700 mt-10">
        ⏳ Loading student details...
      </p>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-10 sm:px-6 md:px-10 lg:px-20 bg-gradient-to-br from-blue-50 to-white">
      {/* Home Icon */}
      <div
        className="absolute top-6 left-6 sm:left-10 cursor-pointer z-20"
        onClick={() => navigate("/")}
      >
        <FaHome className="text-blue-600 text-3xl hover:text-blue-800 transition-colors" />
      </div>

      {/* Top Logo */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <img
          src="/logo.png"
          alt="Piedocx Logo"
          className="h-16 sm:h-20 w-auto drop-shadow-lg"
          data-aos="fade-down"
        />
      </div>

      {/* Typewriter Effect */}
      <div className="relative z-10 mb-6 text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
          <Typewriter
            options={{
              strings: ["Piedocx Technologies Pvt. Ltd."],
              autoStart: true,
              loop: true,
              delay: 75,
              deleteSpeed: 50,
              cursor: "_",
            }}
          />
        </h1>
      </div>

      {/* Info Card with Logo Background */}
      <div
        className="relative z-10 w-full max-w-xl sm:max-w-2xl lg:max-w-3xl bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-6 sm:p-10 border border-blue-100 overflow-hidden"
        data-aos="zoom-in"
      >
        {/* Background Logo inside Card */}
        <img
          src="/Logo_Pie.png"
          alt="Piedocx Background Logo"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 w-64 sm:w-80"
        />

        <h2
          className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-blue-700 mb-6 sm:mb-8 font-sans drop-shadow-md"
          data-aos="fade-down"
        >
          🎓 Student Information
        </h2>

        {/* Responsive Student Info List */}
        <ul
          className="relative space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-gray-800"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {[
            { label: "👤 Name", value: student.name },
            { label: "🆔 Registration No", value: student.registration },
            { label: "🏫 College", value: student.college },
            { label: "📚 Branch", value: student.branch },
            { label: "📅 Year", value: student.year },
            { label: "💻 Technology", value: student.technology },
            { label: "🚀 Start Date", value: student.startDate },
            { label: "🏁 End Date", value: student.endDate },
          ].map((item, idx) => (
            <li
              key={idx}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-2 sm:pb-3 hover:pl-2 transition-all gap-1 sm:gap-2"
            >
              <span className="font-medium text-blue-700">{item.label}:</span>
              <span className="break-words text-gray-800">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Piedocx Description */}
      <div
        className="max-w-full sm:max-w-3xl text-center mt-8 sm:mt-12 px-4 sm:px-6 py-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-blue-100"
        data-aos="fade-up"
      >
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mb-3">
          About Piedocx Technologies 🚀
        </h3>
        <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed break-words">
          <strong>Piedocx Technologies Pvt. Ltd., Lucknow</strong> is a
          next-generation software development and training company
          specializing in web, mobile, and enterprise solutions. We empower
          students and professionals with{" "}
          <span className="text-blue-600 font-semibold">
            hands-on projects, Summer training, Winter training, industrial
            training, internships,
          </span>{" "}
          and cutting-edge technologies to build a successful career in IT.
        </p>
      </div>
    </div>
  );
}

export default StudentDetails;
