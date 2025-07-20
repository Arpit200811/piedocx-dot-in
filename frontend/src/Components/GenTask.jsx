import React from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { base_url } from '../utils/info';
const schema = yup
  .object()
  .shape({
    empid: yup.string().required(),
    title: yup.string().required().min(3).max(50),
    description: yup.string().required().min(3).max(1000),
 
  })
  .required();

function GenTask() {

    const { register, handleSubmit,reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
      });


    const generateTask = async (data) => {
        console.log(data);
        const response = await axios.post(`${base_url}/add-task`, data);
        console.log(response.data);
        if (response.data.success) {
            Swal.fire({
                title: response.data.msg,
                icon: 'success',
                confirmButtonText: 'OK'
            });
        reset();

        } else {
            Swal.fire({
                title: response.data.msg,
                icon: 'error',
                confirmButtonText: 'OK'
            });

        }
        }
  

  return (
    <>
    {/* This form uses the fabform.io form backend service */}
<div className="relative flex items-top justify-center min-h-screen  sm:items-center sm:pt-0">
  <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
    <div className="mt-8 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-6 mr-2 bg-gray-100 dark:bg-gray-800 sm:rounded-lg">
          <h1 className="text-4xl text-center sm:text-5xl text-gray-800 dark:text-white font-extrabold tracking-tight">
            Generate Task 
          </h1>
          
          <div className="flex items-center mt-8 text-gray-600 dark:text-gray-400">
            {/* Address information here */}
            {/* <h1>Hello mere bhai</h1> */}
          </div>
         
         
        </div>
        <form onSubmit={handleSubmit(generateTask)} method="post" className="p-6  flex flex-col justify-center">
          <div className="flex flex-col">
            <label htmlFor="name" className="">Employee Id</label>
            <input {...register("empid")} type="name"  id="name" placeholder="enter employee id" className="w-100 mt-2 py-3 px-3 rounded-lg  border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" />
          </div>
          {errors.empid && <p className='text-red-400'>{errors.empid.message}</p>}
          <div className="flex flex-col mt-2">
            <label htmlFor="email" className="">Title</label>
            <input  {...register("title")} type="text"  id="email" placeholder="enter title" className="w-100 mt-2 py-3 px-3 rounded-lg  border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" />
          </div>
          {errors.title && <p className='text-red-400'>{errors.title.message}</p>}
          <div className="flex flex-col mt-2">
            <label htmlFor="message" className="">Description</label>
            <textarea  id="message" {...register("description")} placeholder="enter description of project/task" className="w-100 mt-2 py-3 px-3 rounded-lg  border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none" defaultValue={""} />
          </div>
          {errors.description && <p className='text-red-400'>{errors.description.message}</p>}
          <button type="submit" className="md:w-32 bg-black  text-white font-bold py-3 px-6 rounded-lg mt-3 hover:bg-indigo-500 transition ease-in-out duration-300">
            Submit
          </button>
        
        </form>
      </div>
    </div>
  </div>
</div>
    </>
  )
}

export default GenTask