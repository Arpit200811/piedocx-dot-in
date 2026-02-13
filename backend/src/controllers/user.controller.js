
import User from '../models/user.model.js'


const userInfo = async(req, res) =>{
    try {
        const {name, email, address, message, source} = req.body
        const user =  await User.create({name, email, address, message, source: source || 'general'})
        res.status(201).json({message:"Submission successful!", user})
    } catch (error) {
        console.error("userInfo error:", error);
        res.status(500).json({message:"Internal server error "})
    }
}

export const getAllSubmissions = async (req, res) => {
    try {
        const { source } = req.query;
        const filter = source ? { source } : {};
        const submissions = await User.find(filter).sort({ createdAt: -1 });
        res.status(200).json(submissions);
    } catch (error) {
        console.error("getAllSubmissions error:", error);
        res.status(500).json({ message: "Error fetching data" });
    }
};

export const deleteSubmission = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Submission deleted successfully" });
    } catch (error) {
        console.error("deleteSubmission error:", error);
        res.status(500).json({ message: "Error deleting submission" });
    }
};

export default userInfo;







