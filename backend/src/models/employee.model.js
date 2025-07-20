import mongoose from 'mongoose'


const employeeSchema = new mongoose.Schema({
    name:{
        type:String, 
        required:true,
    },
    email:{
        type:String, 
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    empid:{
        type:String,
        required:true,
        unique:true,
    },
   time:{
    type:String,
   }
}, {timestamps:true})

const Employee = mongoose.model("Employee", employeeSchema)

export default Employee
