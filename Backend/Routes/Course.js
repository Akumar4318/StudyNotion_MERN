// Import the required modules
const express = require("express")
const router = express.Router()

// Course Controllers Import
const{createCourse,showAllCourses,getCourseDetails,getFullCourseDetails,editCourse ,getInstructorCourses,deleteCourse,}=require('../Controllers/Course')

// Categories Controllers Import
const{showAllCategories,createCategory,categoryPageDetails,}=require('../Controllers/Category')

// sections controllers
const{createSection,updateSection,deleteSection}=require('../Controllers/Section')


//Sub-section controllers

const{createsubSection}=require('../Controllers/subSections')


// Rating controllers 
const{createRating,getAvgRating,getAllrating}=require('../Controllers/RatingAndReview')

// Importing Middlewares

const{auth,isStudent,isInstructor,isAdmin}=require('../Middleware/auth')





// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************


// course only be created by instructor

router.post('/createcourse',auth,isInstructor,createCourse)

// Add a section to a course
router.post('/addsection',auth,isInstructor,createSection)

// update a section
router.post('/updatesection',auth,isInstructor,updateSection)

//DeleteSection
router.post('/deletesection',auth,isInstructor,deleteSection)

//Add a subsection
router.post('/addsubsection',auth,isInstructor,createsubSection)

//NOTE - delete a sub-section
//NOTE - update a sub-section


// get all registered Course
router.get('/getallcourses',showAllCourses)

// get details for a specific courses
router.post('/getcoursedetails',getCourseDetails)

// get details for a specific courses
// router.post('/getfullcousedetails',auth,getFullCourseDetails)

//edit course 
//NOTE - get all courses under a specific instuructor
//NOTE - delete course



//NOTE - update course Progress



// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************

router.post('/createcategory',auth,isAdmin,createCategory)
router.get('/showallcategories',showAllCategories)
router.post('/getCategorypagedetails',categoryPageDetails)


// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************

router.post('/creatingrating',auth,isStudent,createRating)
router.get('/getaveragerating',getAvgRating)
router.get('/getreviews',getAllrating)

module.exports=router