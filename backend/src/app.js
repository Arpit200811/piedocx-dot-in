import express from 'express'
import {config} from 'dotenv'
import connectDB from './config/db.js'
import cors from 'cors'
import router from './routes/user.route.js'
import empRoutes from './routes/employee.route.js'
import parser from 'cookie-parser'
import adminRoutes from './routes/admin.route.js'
import taskRoutes from './routes/task.route.js'

const app = express()
config()

app.use(cors({
    origin:"https://piedocx-dot-in-1.onrender.com/",
    credentials:true
}))
app.use(parser())
app.use(express.json())







app.use(router)
app.use(empRoutes)
app.use(adminRoutes)
app.use(taskRoutes)





app.listen(process.env.PORT, ()=>{
    connectDB()
})




