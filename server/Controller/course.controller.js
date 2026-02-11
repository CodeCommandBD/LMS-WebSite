import Course from "../models/course.model.js";


export const createCourse = async (req,res) => {
    try {
        const {courseTitle,category} = req.body;
        if(!courseTitle || !category){
            return res.status(400).json({success:false,message:"All fields are required"})
        }
        const course = await Course.create({
            courseTitle,
            category,
            creator:req.user.id
        })
        res.status(201).json({success:true,course,message:"Course created successfully"})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}