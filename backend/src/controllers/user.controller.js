
import User from '../models/user.model.js'


const userInfo = async(req, res) =>{
    try {
        const {name, email, address, message} = req.body
    const user =  await User.create({name, email, address, message})
     res.status(201).json({message:"user info submitted !", user})
    } catch (error) {
        console.log("Error in userInfo controller : ", error.message );
        res.status(500).json({message:"Internal server error "})
    }
}

export default userInfo





