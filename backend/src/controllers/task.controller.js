import Employee from '../models/employee.model.js';
import Task from '../models/tasks.model.js'



export const addTask = async (req, res) => {
  const { title, description, empid } = req.body;
  try {
    const isRegistered = await Employee.findOne({ empid });
  if (!isRegistered) {
return res.send({
      success: false,
      data: null,
      code: 400,
      error:true,
      msg:"Not Registered Employee !"
    })
  }
    const task = await Task.create({title, description, empid})
    res.send({
      success: true,
      data: task,
      code: 201,
      error:false,
      msg:"Task added successfully !"
    })
  } catch (error) {
     res.send({
      success: false,
      data: error,
      code: 500,
      error:true,
      msg:"Internal server error !"
    })
  }
};

export const getTask = async (req, res) => {
 try {
    const tasks = await Task.find();
    res.send(tasks);
 } catch (error) {
    res.send(error)
 }
};


export const getTaskOfEmp = async (req, res) => {
 try {
    
    const tasks = await Task.find({empid});
    res.send(tasks);
 } catch (error) {
    res.send(error)
 }
};