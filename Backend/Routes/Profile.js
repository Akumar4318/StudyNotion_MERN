const express = require("express")
const router = express.Router()
const{auth,isInstructor}=require('../Middleware/auth')


const{updateProfile,deleteAccount,getUserDetails,updateDisplayPicture,
    getEnrolledCourses,}=require('../Controllers/Profile')
 
const {isDemo}=require('../Middleware/demo')    

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// delete User Account
router.delete('/deleteprofile',auth,isDemo,deleteAccount)

//updateProfile
router.put('/updateprofile',auth,isDemo,updateProfile)

// getUserDetails

router.get('/getuserdetails',auth,getUserDetails)

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth,isDemo, updateDisplayPicture)

module.exports=router