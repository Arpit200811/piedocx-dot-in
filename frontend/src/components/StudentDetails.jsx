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
import { ShieldCheck, ShieldAlert, X } from "lucide-react";


function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        // Try New Certificate API first
        const res = await axios.get(`${base_url}/api/certificate/view/${id}`);
        setStudent(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          try {
            // Try Legacy Student API as fallback
            const resLegacy = await axios.get(`${base_url}/api/students/${id}`);
            const legacyData = resLegacy.data;
            // Map legacy fields to new UI format
            setStudent({
              fullName: legacyData.name,
              studentId: legacyData.registration,
              college: legacyData.college,
              branch: legacyData.branch,
              year: legacyData.year,
              status: 'active', // Legacy records are active by default
              technology: legacyData.technology, // Extra info
              isLegacy: true
            });
          } catch (legacyErr) {
            setStudent({ error: true, message: "Certificate record not found." });
          }
        } else {
          setStudent({ error: true, message: err.response?.data?.message || "Error fetching records." });
        }
      }
    };
    fetchStudent();
  }, [id]);


  if (!student)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
        <img
          src="/pie_logo.png"
          alt="Piedocx Logo"
          className="h-20 sm:h-24 w-auto mb-6 animate-bounce"
        />
        <h2 className="text-center text-lg sm:text-xl font-semibold text-blue-700">
          <Typewriter
            options={{
              strings: [
                "⏳ Validating Certificate...",
                "🔹 Checking Security Status...",
                "💻 Fetching verified records...",
              ],
              autoStart: true,
              loop: true,
              delay: 50,
              deleteSpeed: 25,
              cursor: "|",
            }}
          />
        </h2>
      </div>
    );

  if (student.error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 px-6 text-center">
         <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 border-4 border-red-200">
            <X className="text-red-600 w-12 h-12" />
         </div>
         <h1 className="text-3xl font-black text-red-900 mb-2 uppercase tracking-tighter">Verification Failed</h1>
         <p className="text-red-600 font-bold mb-8 uppercase tracking-widest text-xs">The requested certificate ID does not exist in our database.</p>
         <button onClick={() => navigate('/')} className="bg-red-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-red-500/20">BACK TO HOME</button>
      </div>
    )
  }

  const isRevoked = student.status === 'revoked';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start relative px-4 py-20 bg-gradient-to-br ${isRevoked ? 'from-red-50 to-white' : 'from-blue-50 to-white'}`}>
      {/* Home Icon */}
      <div
        className="absolute top-6 left-4 sm:left-6 md:left-10 cursor-pointer z-20"
        onClick={() => navigate("/")}
      >
        <FaHome className={`${isRevoked ? 'text-red-600' : 'text-blue-600'} text-2xl sm:text-3xl hover:opacity-80 transition-colors`} />
      </div>

      {/* Top Logo */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <img
          src="/logo.png"
          alt="Piedocx Logo"
          className="h-14 sm:h-16 md:h-20 w-auto"
          data-aos="fade-down"
        />
      </div>

      {/* Info Card */}
      <div
        className={`relative z-10 w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-white/90 backdrop-blur-md shadow-2xl rounded-[40px] p-6 sm:p-12 border ${isRevoked ? 'border-red-200' : 'border-blue-100'} overflow-hidden mt-20`}
        data-aos="zoom-in"
      >
        {isRevoked && (
           <div className="absolute inset-0 bg-red-600/5 flex flex-col items-center justify-center pointer-events-none z-0">
               <div className="transform -rotate-45 text-[60px] font-black text-red-600/10 border-8 border-red-600/10 px-10 rounded-full">REVOKED</div>
           </div>
        )}

        <div className="relative z-10">
           {isRevoked ? (
              <div className="bg-red-600 text-white p-6 rounded-3xl mb-8 flex items-center gap-4 animate-pulse">
                  <ShieldAlert className="w-12 h-12 shrink-0" />
                  <div>
                      <h3 className="font-black text-xl leading-none mb-1 uppercase tracking-tight">Access Prohibited</h3>
                      <p className="text-red-100 text-sm font-medium">This certificate has been <span className="underline decoration-2">REVOKED</span> by Piedocx Technologies. Please contact administration for verification.</p>
                  </div>
              </div>
           ) : (
              <div className="bg-green-600/10 text-green-700 p-4 rounded-2xl mb-8 flex items-center justify-center gap-3 border border-green-200">
                  <ShieldCheck className="w-6 h-6" />
                  <span className="font-black uppercase tracking-widest text-[10px]">Verified Digital Credential</span>
              </div>
           )}

           <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black text-center ${isRevoked ? 'text-red-900' : 'text-blue-700'} mb-8 uppercase tracking-tighter`}>
             Student Records
           </h2>

           <ul className="space-y-4 mb-10">
             {[
               { label: "Full Name", value: student.fullName },
               { label: "Student ID", value: student.studentId },
               { label: "Institution", value: student.college },
               { label: "Branch", value: student.branch },
               { label: "Batch Year", value: student.year },
               { label: "Status", value: student.status.toUpperCase(), highlight: isRevoked ? 'text-red-600' : 'text-green-600' },
             ].map((item, idx) => (
               <li key={idx} className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-100 pb-3 gap-1">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{item.label}</span>
                 <span className={`text-base font-bold ${item.highlight || 'text-slate-800'}`}>{item.value}</span>
               </li>
             ))}
           </ul>
        </div>
      </div>

      {/* Piedocx Description */}
      <div
        className="max-w-full sm:max-w-2xl md:max-w-3xl text-center mt-8 sm:mt-10 md:mt-12 px-4 sm:px-6 py-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-blue-100 break-words"
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
