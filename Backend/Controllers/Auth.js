const User=require('../Models/User')
const OTP=require('../Models/OTP')
const otpGenerator=require('otp-generator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const mailSender=require('../utils/mailSender')
const {passwordUpdated}=require('../mail/templates/passwordUpdate')
const Profile=require('../Models/Profile')
require('dotenv').config()

// sendOTP

// exports.sendOTP=async(req,res)=>{
//     try {
        
//         //? fetch gamil from the req.body

//         const {email}=req.body 

//         //? check wheater the email is already present or not

//         const checkUserPresent=await User.findOne({email})

//         //? if user already exist then return a response

//         if(checkUserPresent){
//             return res.status(401).json({
//                 success:false,
//                 message:"user already registered",
//             })
//         }

//         //? generate otp

//         let otp=otpGenerator.generate(6,{
//             upperCaseAlphabets:false,
//             lowerCaseAlphabets:false,
//             specialChars:false,
//         });

//         console.log('otp genreated: ',otp)
       
//         // check unique otp or not

//         let result=await OTP.findone({otp:otp})

//         while(result){

//             otp=otpGenerator.generate(6,{
//                 upperCaseAlphabets:false,
//                 lowerCaseAlphabets:false,
//                 specialChars:false,
//             });

//             result=await OTP.findone({otp:otp})
//         }

//         const otpPayload={email,otp}

//         //? create new entry for the otp

//         const otpBody=await OTP.create(otpPayload)
//         console.log(otpBody);
//     } catch (error) {
        
//         console.log(error)

//         return res.status(400).json({
//             success:false,
//             message:"error while generating otp"
//         })

//     }
// }

// signUp

exports.singUp=async(req,res)=>{
    
try {
    
    //? fetch all details from body

    const {  firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,}=req.body 

    //? validate karo ki sab hai ki nhi

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      })
    }

    //?check  both password are same or not

    if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:"password and confirmPassword should be same please try again "
        })
    }

    //? cheack the user are same or not

    const existingUser=await User.findOne({email})

    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User is already registered please use different email"
        })
    }

    //? if there is new user then find the most recent otp from db

    const recentOTP= await OTP.findOne({email}).sort({createdAt:-1}).limit(1);



    //? validate otp

    if(recentOTP.length === 0){
        return res.status(400).json({
            success:false,
            message:'OTP NOT FOUND'
        })
    }
    else if(otp !== recentOTP.otp){

        //invalid otp

        return res.status(400).json({
            success:false,
            message:"invalid otp"
        })
    }

    //? Hashed password 

    let hashedPassword=await bcrypt.hash(password,10)

    let approved = ""
    approved === "Instructor" ? (approved = false) : (approved = true)

    //? create entry  in db

    const profileDetails=await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null
    })

    const user=await User.create({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        accountType:accountType,
        additionalDetails:profileDetails._id,
        approved:approved,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })

    //? return response

    return res.status(200).json({
        success:true,
        message:"user is registered successfully",
        user
    })

} catch (error) {
    
    console.log(error)
    return res.status(400).json({
        success:false,
        message:"user is not able to registered while singup"
    })
}

}

// login

exports.login=async(req,res)=>{

    try {
        
        //? get all data from req.body

        const {email,password}=req.body 
        
        //? validate data 

        if(!email || ! password){
            return res.status(403).json({
                success:false,
                message:"All fields are required , please try again"
            })
        }

        //? user check exist or not

        const user=await User.findOne({email}).populate("additionalDetails")

        if(!user){
            return res.status(401).json({
                success:false,
                message:"user is not registered , please singup first"
            })
        }

        //? genreate jwt token after password matching

        if(await bcrypt.compare(password,user.password)){

            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }

            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:'2h'
            })

            user.token=token
            user.password=undefined;

            //? create cookie and send response

            const options={
                expiresIn:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,user,
                message:"user loged in successfully"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:'password is incorrect'
            })
        }

    } catch (error) {
        
        console.log(error)
        
        return res.status(500).json({
            success:false,
            message:"login failure please try again"
        })
    }
}

// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
    try {
      const { email } = req.body
  console.log(email)
      // Check if user is already present
      // Find user with provided email
      const checkUserPresent = await User.findOne({ email })
      // to be used in case of signup
  
      // If user found with provided email
      if (checkUserPresent) {
        // Return 401 Unauthorized status code with error message
        return res.status(401).json({
          success: false,
          message: `User is Already Registered`,
        })
      }
  
      var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
      const result = await OTP.findOne({ otp: otp })
      
      console.log("Result is Generate OTP Func")
      console.log("OTP", otp)
      console.log("Result", result)
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
        })
      }
      const otpPayload = { email, otp }
      const otpBody = await OTP.create(otpPayload)
      console.log("OTP Body", otpBody)
      res.status(200).json({
        success: true,
        message: `OTP Sent Successfully`,
        otp,
      })
    } catch (error) {
      console.log(error.message)
      return res.status(500).json({ success: false, error: error.message })
    }
  }
  
  // Controller for Changing Password
  exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      const userDetails = await User.findById(req.user.id)
  
      // Get old password, new password, and confirm new password from req.body
      const { oldPassword, newPassword } = req.body
  
      // Validate old password
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      )
      if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  
      // Update password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password for your account has been updated",
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        )
        console.log("Email sent successfully:", emailResponse.response)
      } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }
  
      // Return success response
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
  }