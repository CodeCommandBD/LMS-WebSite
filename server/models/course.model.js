import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseTitle:{
        type:String,
        default:""
    },
    subtitle:{
        type:String,
        default:""
    },
    description:{
        type:String,
        default:""
    },
    category:{
        type:String,
        required:true
    },
    courseLavel:{
        type:String,
        enum:["Beginner","Intermediate","Advanced"],
        default:"Beginner"
    },
    courseThumbnail:{
        type:String,
        default:""
    },
    enrolledStudents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    lecture:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lecture"
        }
    ],
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    price:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["Published","Draft"],
        default:"Draft"
    }
},{timestamps:true})

const Course = mongoose.model("Course",courseSchema)

export default Course
