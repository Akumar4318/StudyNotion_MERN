import { setLoading } from "../../Slice/authSlice"
import { apiConnector } from "../apiconnector";
import {toast} from 'react-hot-toast'

import {endpoints} from '../api'




const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
  } = endpoints



export function getPasswordResetToken(email,setEmailSent){

    return async(dispatch)=>{

        dispatch(setLoading(true));
        try {
            
            const response=await apiConnector("POST",RESETPASSTOKEN_API,{email})
            console.log('RESET PASSWOR  TOKEN RESPONSE ....',response)

            if(!response.data.success){
                throw new Error(response.data.message )
            }
            toast.success("Reset Email sent")
            setEmailSent(true)
        } catch (error) {
            console.log("RESET PASSOWRD TOKEN ERROR");
            console.log(error)
            toast.error("Failed to send email for resetting the passowrd")
        }
        dispatch(setLoading(false))
    }
}


export function resetPassword(token,confirmPassword,password){

    return async(dispatch)=>{

        dispatch(setLoading(true));
        try {
            
            const response=await apiConnector("POST",RESETPASSWORD_API,{password,confirmPassword,token});
            console.log("RESET PASSOWRD RESPONSE ...",response);

            if(!response.data.sucess){
                throw new Error (response.data.message);

            }

            toast.success("Password has been reset successfully")
        } catch (error) {
            console.log("Unbale reset Password");
            console.log(error)
            toast.error("Failed to reset the  passowrd")
        }
        dispatch(setLoading(true));
    }
}