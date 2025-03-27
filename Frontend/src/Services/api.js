

const BASE_URL = "http://localhost:3000/api/v1"

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