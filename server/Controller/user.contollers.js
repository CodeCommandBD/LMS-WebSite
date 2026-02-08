import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if(!name || !email || !password || !role){
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
       const user = await User.findOne({email});
       if(user){
           return res.status(400).json({ success: false, message: "Account already exists with this email" });
       }

       await User.create({ name, email, password, role });
       return res.status(201).json({ success: true, message: "Account created successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}