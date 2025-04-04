const Section=require('../Models/Section')
const Course=require('../Models/Course');




exports.createSection=async(req,res)=>{

    try {
        
        // data fetch

        const {sectionName,courseId}=req.body ;
         //? data validation

         if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties"
            })
         }

         //? create sections
         const newSection=await Section.create({sectionName})

         //? update course with section objectId

         const updateCourseDetails=await Course.findByIdAndUpdate(
                                            courseId,{
                                                $push:{
                                                    courseContent:newSection._id,
                                                },
                                            },
                                            {new:true}
         )
         .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec(); 
         // how to use populate section and subsection


         return res.status(200).json({
            success:true,
            message:"Course update Successfully",
            data:updateCourseDetails
         })

    } catch (error) {
        
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Unable create Section please try again",
            error:error.message
        })
    }
}

/// update a section

exports.updateSection=async(req,res)=>{
    try {
        
        //?  data input
        const {sectionName,sectionId}=req.body 
        //? data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties"
            })
         }
          //? update data
         const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})
            //? return res
              
            return res.status(200).json({
                success:true,
                message:"section updated successfully"
            })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable update Section please try again",
            error:error.message
        })
    }
}

// delete sections

exports.deleteSection=async(req,res)=>{

    try {
        
        //? get id -- assuming that we are sending ID in params

        const {sectionId}=req.params
        //? use findby id and delete

        await Section.findByIdAndDelete(sectionId)
        //? return res

        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully"

        })
         
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable delete Section please try again",
            error:error.message
        })
    }
}