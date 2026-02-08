import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if(!name || !email || !password || !role){
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.create({ name, email, password, role });
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}