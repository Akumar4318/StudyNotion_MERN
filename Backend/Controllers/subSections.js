const Section=require('../Models/Section')
const SubSection = require('../Models/SubSection')

const { uploadImageToCloudinary } = require('../utils/imageUploader')
require('dotenv').config()

// create subsection

exports.createsubSection=async(req,res)=>{

    try {
        //? fetch data from req.body
        const{title,description,sectionId,timeDuration}=req.body 

        //? extract file/video
        const video=req.files.videoFile
        //? validation
        if(!sectionId  || !title || !timeDuration || !description){

            return res.status(400).json({
                success:false,
                message:"All files are required"
            })
        }
        //? upload video to cloudinary ---> secure url
        const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME)
        //? create a subsection
        const subSectionDetails=await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url
        })
        //? push the sub-section id into section
            //? update section with thise sub section objectId
        const updateSection= await Section.findByIdAndUpdate({_id:sectionId},
                                                        {
                                                            $push:{
                                                                SubSection:subSectionDetails._id,
                                                            }
                                                        },{new:true}


        );
        //TODO -  log update section here after adding populate qurey 

        //? return .json

        return res.status(200).json({

            succeess:true,
            message:"sub section creates successfully"
        })
    } catch (error) {
        
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message
        })

    }
}

//TODO -  update subsection 
//TODO - delete subsection