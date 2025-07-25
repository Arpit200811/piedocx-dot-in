import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    }, 
    description:{
        type:String,
        required:true,
    },
   empid:{
    type:String,
    required:true,
   },
   
})

const Task = mongoose.model("Task", taskSchema)

export default Task