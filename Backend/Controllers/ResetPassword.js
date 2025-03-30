const User=require('../Models/User')
const mailSender=require('../utils/mailSender')
const bcrypt=require('bcrypt')
const crypto=require('crypto')



// resetPassword token

exports.resetPasswordToken=async(req,res)=>{

  try {
    
      //? get email from req,body

      const email=req.body.email

      //? check user for this email , email validation
  
      const user=await User.findOne({email})
  
      if(!user){
          return res.status(400).json({
              success:false,
              message:`This Email: ${email} is not Registered With Us Enter a Valid Email `,
          })
      }
      //? token generate and add expire time 
  
      const token=crypto.randomUUID();
  
      //? update user by adding token and expiration time 
  
      const updatedDetails=await User.findOneAndUpdate({email:email},{
          token:token,
          resetPasswordExpire:Date.now()+5*60*1000
      },{new:true})
      //? create url 
  
      const url = `http://localhost:3000/update-password/${token}`;
      //? send mail containing the url 

      console.log("updateDetials",updatedDetails)
  
      await mailSender(email,"Password Reset Link",
          `Your Link for email verification is ${url}. Please click this url to reset your password.`
      )
      // ? return response

      return res.status(200).json({
        success:true,
        message:"email sent successfully please check email and change password"
      })
  } catch (error) {
    
    console.log(error)

    return res.status(500).json({
        success:false,
        message:"Somthing went wrong while reseting the password",
        message:error.message,
    })
  }

}


// resetPassword

exports.resetPassword=async(req,res)=>{

    try {
        
        // fetch data 

        const{password,confirmPassword,token}=req.body 

        //? validation 
        if(password !==confirmPassword){
            return res.status(400).json({
                success:false,
                message:'passwrod is not matching'
            })
        }

        //? get UserDetails from db using token 
        const userDetails=await User.findOne({token:token})

        //? if no entry -- invalid token 
        if(!userDetails){
            return res.json({
                success:false,
                message:'token is invalid'
            })
        }

        // token time check 

        if(userDetails.resetPasswordExpires<Date.now()){
            return res.json({
                success:false,
                message:"token in expired please regenerate your token ",
            })
        }

        //? hash password

        const hashedPassword=await bcrypt.hash(password,10)

        //? password update

        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true}
        )

        //? return response

        return res.status(200).json({
            success:true,
            message:"password reset successfully"
        })
    } catch (error) {
        
         res.status(400).json({
            success:false,
            message:"Somthing went wrong while sending  the reset password",
            message:error.message
        })
    }
}