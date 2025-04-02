

const BASE_URL = import.meta.env.VITE_BASE_URL;



// AUTH ENDPOINTS
export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/resetpasswordtoken",
    RESETPASSWORD_API: BASE_URL + "/auth/resetpassword",
  }

//LINK - CATEGORIES API
export const categories={

    CATEGORIES_API:BASE_URL+'/course/showallcategories'
}

//LINK - SETTINGS PAGE API

export const settingsEndpoints={

    CHANGEPASSWORD_API:BASE_URL+'/auth/changepassword'
}

//LINK -  CONTACT-US API
export const contactusEndpoint = {
    CONTACT_US_API: BASE_URL + "/reach/contact",
  }


  //LINK -  PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
}