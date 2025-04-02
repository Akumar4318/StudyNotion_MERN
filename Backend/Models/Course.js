const mongoose=require('mongoose')


const courseSchema=new mongoose.Schema({

   courseName:{
    type:String,
    trim:true,
    required:true,
   },
   courseDescription:{
    type:String,
    trim:true,
    required:true,
   },
   instructor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
   },
   whatYouWillLearn:{
    type:String,
    trim:true,
    required:true,
   },
   courseContent:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Section",
    required:true,
   }],
   ratingAndReview:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"RatingAndReview",
    required:true,
   }],
   price:{
    type:Number,
    trim:true,
    required:true,
   },
   thumbnail:{
    type:String,
    trim:true,
    
   },
   Category:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Category"
   }, 
   tag:{
    type:[String],
    required:true,
   },
   studenEnrolled:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
   }],
   indturctions:{
      type:[String]
   },
   status:{
      type:String,
      enum:["Draft","Published"],
   },
   createdAt:{
      type:Date,
      default:Date.now()
   }

})

module.exports= mongoose.model("Course",courseSchema)