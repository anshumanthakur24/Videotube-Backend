import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import {jwt} from "jsonwebtoken";
import {User} from "../models/User";

export const veriyfJWT= asyncHandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        
        if(!token){
            throw new ApiError(401,"Unauthorized");
        }
    
        const decodeToken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        await User.findById(decodeToken?._id).select("-password -refreshToken");
        
        if(!user){
            //TODO discuss about frontend
            throw new ApiError(401,"Unauthorized");
        }
    
        req.user=user;
        next();
    } catch (error) {
        throw new ApiError(401,error?.message|| "Invalid access token");
    }
});