const Course=require('../Models/Course')
// const Tag=require('../Models/Tag')
const Category=require('../Models/Category')
const User=require('../Models/User')
const {uploadImageToCloudinary}=require("../utils/imageUploader")
const SubSection = require('../Models/SubSection')
const Section = require('../Models/Section')
require('dotenv').config()



/// createCourse handler function

exports.createCourse=async(req,res)=>{
    

    try {
        
        //? fetch data from body
        

        const{courseName,courseDescription,whatYouWillLearn,price,tag,category, instructions}=req.body;
     

        //? get thumbnail

        const thumbnail=req.files.thumbnailImage;

        //? validation 
        if(!courseName || !courseDescription || !whatYouWillLearn|| !tag || !price || !category){

            return res.status(400).json({
                success:false,
                message:"all field required"
            })
        }
        
        //? check the insturctor  and obtain the oject .id

        const userId=req.user.id;
        
        const instructorDetails=await User.findById(userId,{
            accountType: "Instructor",
        })
        console.log(instructorDetails)
        
        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"instructor details not found"
            })
        }

        //? check given tag is  valid or not 
       
        const categoryDetails=await Category.findById(category)
     

        if(!categoryDetails){
            return res.status(400).json({
                success:false,
                message:"category details not found"
            })
        }

        //? upload image top cloudinary

        const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)


        // create an entry for new course

        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            tag:tag,
            price,
            category: categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            instructions: instructions,
        })

        //? update the user and add the new course to schema of instructor

        await User.findByIdAndUpdate({
            _id:instructorDetails._id
        },
        {
            $push:{
                courses:newCourse._id,
            }
        },
        {new:true}
    );
    await Category.findByIdAndUpdate(
        { _id: category },
        {
            $push: {
                course: newCourse._id,
            },
        },
        { new: true }
    );

    // update the tag ka schema ?


    return res.status(200).json({
        success:true,
        message:"course create successfully",
        data:newCourse
    })
        

    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"failed to create the course"
        })
    }
}



// get all course handler function

exports.showAllCourses=async(req,res)=>{
    try {
        
        const allCourses=await Course.find({},{courseName:true,
                                                price:true,
                                                thumbnail:true,
                                                instructor:true,
                                                reatingAndReviews:true,
                                                studentsEnrolled:true,
                                                        
        }).populate("instructor").exec();


        return res.status(200).json({
            success:true,
            message:"data for all courses fetched successfully",
            data:allCourses
        })



    } catch (error) {
        
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'cannot fetch course data'
        })
    }
}

//ANCHOR - getCourseDetails


exports.getCourseDetails=async(req,res)=>{
    try {
        
        //? get id
        const {courseId}=req.body;
        //? find courseDetails
        const courseDetails=await Course.find(
                                {_id:courseId}
        ).populate ({
            path:"instructor",
            populate:{
                path:"additionalDetails"
            }
        }).populate("Category")
        // .populate("ratingAndreviews")
        .populate({
            path:"courseContent",
            populate:{
                path:"SubSection",
            }
        }).exec();

        //? validation 
        if(!courseDetails){
            return res.stauts(400).json({
                success:false,
                message:`courd not find the course with ${courseId}`,
               
            })
        }

        //? return response

        return res.status(200).json({
            success:true,
            message:"Course Details fecthed successfully",
            data:courseDetails
        })
    } catch (error) {
        
        console.log(error)
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}


// delete a course
exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnroled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }