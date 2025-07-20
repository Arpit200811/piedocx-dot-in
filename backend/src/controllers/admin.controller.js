import Admin from "../models/admin.model.js";

export const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email, password });
    if (!admin) {
      res.status(404).json({ message: "Invalid credentials  !" });
    } else {
        res.status(201).json({ message: "Logged in  Successfully !" });
    }
  } catch (error) {
    console.log("Error in admin login controller : ", error.message);
    res.status(500).json({ message: "Internal server error  !" });
  }
};
