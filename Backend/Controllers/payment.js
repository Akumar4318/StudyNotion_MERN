const {instance}=require('../Config/razorpay')
const Course=require('../Models/Course')
const User=require('../Models/User')
const mailSender=require('../utils/mailSender')
const {courseEnrollmentEmail}=require('../mail/templates/courseEnrololmentEmail')
const { Types } = require('mongoose')




// capture the payment and intiate the razorpay order

exports.capturePayment=async(req,res)=>{

    //? get courseId and userId

    const {course_Id}=req.body ;
    const{userId}=req.user.id;
    //? valid course id and userid
    if(!course_Id) {

        return res.status(400).json({
            success:false,
            message:"please provide valid course ID"
        })
    }

   
    //? valid courseDetails
    let course;
    try {
        course=await Course.findById(course_Id);
        if(!course_Id){
             res.status(400).json({
                success:false,
                message:"Course not found"
            })
        }

         //? user alresay pay for the same course 

         const uid=new mongoose.Types.ObjectId(userId);
         if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:"Student is already enrolled"
            });
         }
    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
   //? order create
   const amount=course.price;
   const currency="INR";
   const options={
    amount:amount*100,
    currency,
    receipt:Math.random(Date.now()).toString(),
    notes:{
        courseId:course_Id,
        userId
    }
   }

   try {
    
    // intiate the payment using razorpay
    const paymentResponse=await instance.orders.create(options);
    console.log(paymentResponse)

    return res.status(200).json({
        success:true,
        CourseName:course.courseName,
        courseDescription:course.courseDescription,
        thumbnail:course.thumbnail,
        currency:paymentResponse.currency,
        orderid:paymentResponse.orderid,
        amount:paymentResponse.amount
    })

   } catch (error) {
    
    console.log(error)
    res.json({
        success:false,
        message:"could not intitate order"
    })
   }
   
}


// verify signature

exports.verifySignature=async(req,res)=>{

    const webhookSecret="1234567";

    const signature=req.headers["x-razorpay-signature"];


    const shasum=crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body))
    const digest=shasum.digest("hex");

    //match the signature and digest

    if(signature===digest){
         
        console.log("Payment is Authorised")

        const {courseId,userId}=req.body.payload.payment.entity.notes;

        try {
            
            //? fullfill the action find the course and erolled in the course

            const enrolledCourse=await Course.findOneAndUpdate({_id:courseId},{$push:{studentsEnrolled:userId}},{new:true})

            if(!enrolledCourse){
                return res.status(400).json({
                    success:false,
                    message:"course not found"
                })
            }

            console.log(enrolledCourse)

            //? find the student and enrolled the student  in the course
            
            const enrolledStudent=await User.findOneAndUpdate({_id:userId},{$push:{courses:courseId}},{new:true});
            console.log(enrolledStudent)


            /// mail send confirmation mail
            
            const emailResponse=await mailSender(

                                        enrolledStudent.email,
                                        "congratulaion,from Studenthive",
                                        "congratulaion, you are onboarde into new Course",

            );

            console.log(emailResponse)
            return res.status(200).json({
                success:ture,
                message:"Signature verified and course added"
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success:false,
                message:error.message
            })
        }
    }

    else{
        return res.status(400).json({
            success:false,
            message:"Invalid request"
        })    }

}