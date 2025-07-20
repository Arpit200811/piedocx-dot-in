import axios from 'axios';
import React, { useEffect } from 'react'
import { MdCloudUpload } from "react-icons/md";
import { base_url } from '../utils/info';


function Task() {

    const [data, setData] = React.useState([])
    const getdata = async()=>{
       const res = await axios.get(`${base_url}/get-task`)
        console.log(res.data)
        setData(res.data)
    }
    useEffect(()=>{
    getdata()
    },[]
    )
  return (
    <>
    <div className="wraper grid grid-cols-2 gap-10 mt-10  ">

   
 

{data?.map((item, index)=>{
return <div key={index} className="w-lg  mx-auto bg-gray-900 shadow-lg rounded-2xl">
<div className="px-6 py-5">
  <div className="flex items-start">
    <div className="flex-grow truncate">
      <div className="w-full flex  justify-between items-center mb-3">
        <h2 className="text-2xl leading-snug font-extrabold text-gray-50 truncate mb-1 sm:mb-0">{item.title}</h2> 
        <label htmlFor="task-upload">
          <MdCloudUpload className='text-white text-5xl cursor-pointer'/>
          <input hidden id='task-upload' type="file" />
        </label>
      </div>
      <div className="flex gap-5">
      <span className="bg-red-500 px-2 py-0.5 font-semibold text-sm rounded-lg text-white">Open</span>
      <span className="bg-yellow-500 px-2 py-0.5 font-semibold text-sm rounded-lg text-white">In-progress</span>
      <span className="bg-green-500 px-2 py-0.5 font-semibold text-sm rounded-lg text-white">Closed</span>
      </div>
      <div className="flex items-end justify-between whitespace-normal">
        <div className="max-w-md text-indigo-100">
          <p className="mb-2">{item.description}</p>
        </div>
      </div>
    
    </div>
  
  </div>
</div>
</div>
})}



</div>



    </>
  )
}

export default Task