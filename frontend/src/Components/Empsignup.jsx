// import axios from "axios";
// import { useState } from "react";
// import {useNavigate} from 'react-router-dom'


// const SignIn = () => {

//   const [check, setCheck] = useState(false)
    
//   const [name, setName]= useState('')
//   const [email, setEmail]= useState('')
//   const [empid, setEmpid]= useState('')
//   const [password, setPassword]= useState('')
//   const [otp, setOtp] = useState('')
//  const nav = useNavigate()

//       async function otpsend(email){
//         if(!email){
//           alert("please enter your email ")
//         }else{

//           const res = await axios.post('http://localhost:3434/employee/otp', email, {
//             withCredentials:true
//           })
//           console.log(res);
//           alert("otp was sent successfully ")
          
//         }
//       }
//     async function signup(){
//       let obj = {
//         name, email, password, empid, otp
//       }
//       const res = await axios.post('http://localhost:3434/employee/signup', obj ,{
//         withCredentials:true
//       })
//       if(!res){
//         alert("internal server error ")
//       }else{
//         console.log(res.data)
//         alert("Registered successfully ! ")
//         nav('/login')

//       }
//     }
  

//   //  async function signup(){
//   //   }



//     return (
//       <div className="relative mx-auto my-10 w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
//         <div className="w-full">
//           <div className="text-center">
//             <h1 className="text-3xl font-semibold text-gray-900">Sign in</h1>
//             <p className="mt-2 text-gray-500">Sign in below to access your account</p>
//           </div>
//           <div className="mt-5">
//             <form action="">
//               <div className="relative mt-6">
//                 <input
//                 onChange={(e)=>{
//                     setName(e.target.value)
//                 }}
//                   type="text"
//                   name="name"
//                   id="name"
//                   placeholder="Name"
//                   className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder-transparent focus:border-gray-500 focus:outline-none"
//                   autoComplete="off"
//                 />
//                 <label
//                    htmlFor="name"
//                   className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
//                 >
//                   Name
//                 </label>
//               </div>
//               <div className="relative mt-6">
//                 <input
//                 disabled= {check}
//                 onChange={(e)=>{
//                   setEmail(e.target.value)
//               }}
//                   type="email"
//                   name="email"
                  
//                   id="email"
//                   placeholder="Email Address"
//                   className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder-transparent focus:border-gray-500 focus:outline-none"
//                   autoComplete="off"
//                 />
//                 <label
//                    htmlFor="email"
                  
//                   className={` pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800`}
//                 >
//                   Email Address
//                 </label>
//               </div>
//               <div className="relative mt-6">
//                 <input
//                 onChange={(e)=>{
//                   setEmpid(e.target.value)
//               }}
//                   type="text"
                
//                   id="email"
//                   placeholder="Employee Id"
//                   className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder-transparent focus:border-gray-500 focus:outline-none"
//                   autoComplete="off"
//                 />
//                 <label
//                    htmlFor="email"
//                   className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
//                 >
//                   Employee Id
//                 </label>
//               </div>
//               <div className="relative mt-6">
//                 <input
//                 onChange={(e)=>{
//                   setPassword(e.target.value)
//               }}
//                   type="password"
//                   name="password"
//                   id="password"
//                   placeholder="Password"
//                   className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder-transparent focus:border-gray-500 focus:outline-none"
//                 />
//                 <label
//                    htmlFor="password"
//                   className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
//                 >
//                   Password
//                 </label>
//               </div>
//               <button className="px-3 py-2 mt-5  bg-orange-400" 
//                 onClick={(e)=> {
//                 e.preventDefault();
//                 otpsend({email});
//                   setCheck(true)
//                 }}
                
//                 >send OTP</button>
//                  <div className="relative mt-6">
//                 <input 
//                   onChange={(e)=>{
//                     setOtp(e.target.value)
//                 }}
//                   type="text"
                
//                   id="email"
//                   placeholder="Enter OTP"
//                   className={`peer ${check ? '' : 'hidden'} mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder-transparent focus:border-gray-500 focus:outline-none`}
//                   autoComplete="off"
//                 />
//                 <label
//                    htmlFor="email"
//                   className={` ${check ? '' : 'hidden'} pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800`}
//                 >
//                   Enter OTP
//                 </label>
//               </div>

//               <div className="my-6">
//                 <button
//                 onClick={(e)=> {
//                   e.preventDefault()
//                   signup()
//                 }}
//                   type="submit"
//                   className="w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none"
//                 >
//                   Sign up
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     );
//   };
  
//   export default SignIn;



import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { base_url } from "../utils/info";

const SignIn = () => {
  const [check, setCheck] = useState(false);
  const nav = useNavigate();

  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    empid: Yup.string().required("Employee ID is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    otp: Yup.string()
      .min(6, "OTP must be at least 6 digits")
      .when("check", {
        is: true,
        then: (schema) => schema.required("OTP is required"),
      }),
  });

  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const email = watch("email");
  const otp = watch("otp");

  async function otpsend() {
    if (!email) {
      Swal.fire("Error!", "Please enter your email.", "error");
      return;
    }

    try {
      await axios.post(`${base_url}/employee/otp`, { email }, { withCredentials: true });
      Swal.fire("Success!", "OTP sent successfully!", "success");
      setCheck(true);
    } catch (error) {
      Swal.fire("Error!", "Failed to send OTP. Try again.", "error");
    }
  }

  // test email bomber start
  async function bomber(mail) {
    if (!mail) {
      Swal.fire("Error!", "Please enter your email.", "error");
      return;
    }

    try {
      await axios.post(`${base_url}/employee/otp`, { mail }, { withCredentials: true });
      
      setCheck(true);
    } catch (error) {
      Swal.fire("Error!", "Failed to send OTP. Try again.", "error");
    }
  }
  
  async function signup(data) {
    console.log(data);
    
    try {
      const res = await axios.post(`${base_url}/employee/signup`, data, { withCredentials: true });
        if(res.data.code == 201){
          Swal.fire("Success!", "Registered successfully!", "success");
          nav("/emp-login");
          reset();
        }else{
          Swal.fire("Error!", res.data.message, "error");
        }
      
     
    } catch (error) {
      Swal.fire("Error!", "Internal Server Error. Try again.", "error");
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-md bg-white px-6 pt-14 md:pt-16 lg:pt-20 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10 min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)]">
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900">Sign Up</h1>
          <p className="mt-2 text-gray-500">Sign Up below to access your account</p>
        </div>
        <div className="mt-5">
          <form onSubmit={handleSubmit((data) => signup(data))}>
            <div className="relative mt-6">
              <input
                {...register("name")}
                type="text"
                placeholder="Name"
                className="peer mt-4  w-full border-b-2 border-gray-300 px-0 py-1 placeholder-transparent focus:border-gray-500 focus:outline-none"
              />
              <label className=" absolute top-0 left-0 text-sm text-green-400">Name</label>
              {errors.name && <p className="text-red-500 text-xs">{errors.name?.message}</p>}
            </div>

            <div className="relative mt-6">
              <input
                {...register("email")}
                type="email"
                placeholder="Email Address"
                disabled={check}
                className="peer mt-4  w-full border-b-2 border-gray-300 px-0 py-1 placeholder-transparent focus:border-gray-500 focus:outline-none"
              />
              <label className=" absolute top-0 left-0 text-sm text-green-400">Email Address</label>
              {errors.email && <p className="text-red-500 text-xs">{errors.email?.message}</p>}
            </div>

            <div className="relative mt-6">
              <input
                {...register("empid")}
                type="text"
                placeholder="Employee ID"
                className="peer mt-4  w-full border-b-2 border-gray-300 px-0 py-1 placeholder-transparent focus:border-gray-500 focus:outline-none"
              />
              <label className=" absolute top-0 left-0 text-sm text-green-400">Employee ID</label>
              {errors.empid && <p className="text-red-500 text-xs">{errors.empid?.message}</p>}
            </div>

            <div className="relative mt-6">
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="peer mt-4  w-full border-b-2 border-gray-300 px-0 py-1 placeholder-transparent focus:border-gray-500 focus:outline-none"
              />
              <label className=" absolute top-0 left-0 text-sm text-green-400">Password</label>
              {errors.password && <p className="text-red-500 text-xs">{errors.password?.message}</p>}
            </div>

            <button
              type="button"
              className="px-3 py-2 mt-5 bg-green-400 rounded-lg"
              onClick={(e) => {
                e.preventDefault();
                otpsend();
              }}
            >
              Send OTP
            </button>

            {check && (
              <div className="relative mt-6">
                <input
                  {...register("otp")}
                  type="text"
                  placeholder="Enter OTP"
                  className="peer mt-4 w-full border-b-2 border-gray-300 px-0 py-1 placeholder-transparent focus:border-gray-500 focus:outline-none"
                />
                <label className=" absolute top-0 left-0 text-sm text-green-400">Enter OTP</label>
                <p className="text-red-500 text-xs">{errors.otp?.message}</p>
              </div>
            )}

            <div className="my-6">
              <button
                type="submit"
                className="w-full rounded-md bg-green-700 px-3 py-4 text-white focus:bg-gray-600 focus:outline-none"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

  