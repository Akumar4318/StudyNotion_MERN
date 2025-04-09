const { populate } = require("../Models/Course");
const Profile = require("../Models/Profile");
const User = require("../Models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const CourseProgress = require("../Models/CourseProgress")
exports.updateProfile = async (req, res) => {
  try {
    // ? get data

    const {
      firstName,
      lastName,
      gender = "",
      dateofBirth = "",
      about = "",
      contactNumber = "",
    } = req.body;
    //? userId
    const id = req.user.id;
    //? validation
    if (!gender || !contactNumber || !about || !contactNumber || !dateofBirth) {
      return res.status(400).json({
        success: "false",
        message: "All field are required",
      });
    }
    //? find and update

    const userDetails = await User.findById(id);
    const ProfileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(ProfileId);
    //? update
    profileDetails.dateofBirth = dateofBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;

    await profileDetails.save();
    //? return response

    return res.status(200).json({
      success: true,
      message: "Profile update successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

//REVIEW -  delete account

exports.deleteAccount = async (req, res) => {
  try {
    //? get id

    const id = req.user.id;

    //? find id

    const userDetails = await User.findById(id);
    //? validation
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "No such user Exist",
      });
    }

    //? delete the profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    //TODO -  delete from enrolled countb or unrolled user from all enrolled course

    //? user delete
    await User.findByIdAndDelete({ _id: id });

    //? return res
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "user can not be deleted",
    });
  }
};

///REVIEW -  how can we scheldule the delete account

// to get all the details of user

exports.getUserDetails = async (req, res) => {
  try {
    //? get Id

    const id = req.user.id;
    //? validation and get user Details
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    //? return response
    console.log(userDetails);

    return res.status(200).json({
      success: true,
      message: "user data fetch successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// updateDisplayPicture

exports.updateDisplayPicture = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    const image = req.files.displayPicture;
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const uploadDetails = await uploadImageToCloudinary(
      image,
      process.env.FOLDER_NAME
    );

    console.log(uploadDetails);

    const updateImage = await User.findByIdAndUpdate(
      { _id: id },
      { image: uploadDetails.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Image Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get Enrollement courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    userDetails = userDetails.toObject();

    let SubsectionLength = 0;

    for (let i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;
      for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        );
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos.length;
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
