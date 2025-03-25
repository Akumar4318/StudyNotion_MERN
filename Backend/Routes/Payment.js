// Import the required modules
const express = require("express")

const router = express.Router()

const{auth,isInsturnctor,isStudent,isAdmin}=require("../Middleware/auth")

const{capturePayment,verifySignature}=require('../Controllers/payment')

router.post('/capturepayment',auth,isStudent,capturePayment)
// router.post('/verifypayment',auth,isStudent,verifySignature)

module.exports=router