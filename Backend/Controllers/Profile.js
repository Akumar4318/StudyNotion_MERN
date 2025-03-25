const Profile=require('../Models/Profile')
const User=require('../Models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');


exports.updateProfile=async(req,res)=>{

    try {
        
        // ? get data 

        const{firstName,lastName,gender="",dateOfBirth="",about="",contactNumber=""}=req.body 
        //? userId
        const id=req.user.id;
        //? validation
        if(!gender || !contactNumber || !about || !contactNumber){

            return res.status(400).json({
                success:"false",
                message:"All field are required"
            })
        }
        //? find and update
        
        const userDetails=await User.findById(id)
        const ProfileId=userDetails.additionalDetails
        const profileDetails=await Profile.findById(ProfileId)
        //? update
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;

        await profileDetails.save();
        //? return response

        return res.status(200).json({
            success:true,
            message:"Profile update successfully",
            profileDetails,
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            error:error.message
        })
    }
}

//REVIEW -  delete account

exports.deleteAccount=async(req,res)=>{

    try {
        
        //? get id

        const id=req.user.id;

        //? find id
        
        const userDetails=await User.findById(id)
        //? validation
        if(!userDetails){
            
            return res.status(400).json({
                success:false,
                message:"No such user Exist"
            })
        }

        //? delete the profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
 //TODO -  delete from enrolled countb or unrolled user from all enrolled course
      
        //? user delete 
        await User.findByIdAndDelete({_id:id})

        //? return res
        return res.status(200).json({
            success:true,
            message:"User deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user can not be deleted"
        })
    }
}

///REVIEW -  how can we scheldule the delete account


// to get all the details of user

exports.getUserDetails=async(req,res)=>{
    try {
        
        //? get Id

        const id=req.user.id;
        //? validation and get user Details
        const userDetails=await User.findById(id).populate("additionalDetails").exec();
        //? return response
        console.log(userDetails)

        return res.status(200).json({
            success:true,
            message:"user data fetch successfully",
            data:userDetails
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            error:error.message
        })
    }
}

// updateDisplayPicture

exports.updateDisplayPicture=async(req,res)=>{


    try {
        
        const id=req.user.id;
            const user=await User.findById(id);

            if(!user){
                return res.status(400).json({
                    success:false,
                    message:"user not found",
                })
            }

            const image=req.files.displayPicture;
            if(!image){
                return res.status(404).json({
                    success:false,
                    message:"Image not found"
                })
            }

            const uploadDetails=await uploadImageToCloudinary(
                image,process.env.FOLDER_NAME
            )

            console.log(uploadDetails)

            const updateImage=await User.findByIdAndUpdate({_id:id},{image:uploadDetails.secure_url},{new:true})

            res.status(200).json({
                success:true,
                message:"Image Updated Successfully"
            })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// get Enrollement courses
exports.getEnrolledCourses=async (req,res) => {
	try {
        const id = req.user.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const enrolledCourses = await User.findById(id).populate({
			path : "courses",
				populate : {
					path: "courseContent",
			}
		}
		).populate("courseProgress").exec();
        // console.log(enrolledCourses);
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: enrolledCourses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}