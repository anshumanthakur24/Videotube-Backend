import {asyncHandler} from '../utils/asyncHandler.js';




const registerUser=asyncHandler(async(requestAnimationFrame,res)=>{
    res.status(200).json({
        message:"Zinga la la hu hu"
    })
})

export {registerUser};