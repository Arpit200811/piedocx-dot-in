
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true },
    address: String,
    message: String,
    source: { 
        type: String, 
        enum: ['workshop', 'newsletter', 'contact', 'general'], 
        default: 'general' 
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'responded'],
        default: 'unread'
    }
}, { timestamps: true });



const User = mongoose.model("User",userSchema )


export default User

