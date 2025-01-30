import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const generateAccessAndRefreshTokens= async(userId)=>{
    try {
        const user =  await  User.findById(userId)
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();

        user.refreshToken=refreshToken;
        await user.save({validiateBeforeSave:false});

        return {accessToken,refreshToken};

    } catch (error) {
        throw new ApiError(500,"Failed to generate tokens");
    }
}

const registerUser=asyncHandler(async(req,res)=>{
    //get user details from frontemd
    //validiation - not empty
    //check if user already exists: username , email
    //check for images , check for avatar
    //upload them to cloudinart, avatar
    //create user object- create entry in db
    //remove  password and refresh token from response
    //check for user creation
    //retrun response


    const {fullName,email,username,password}=req.body //json or forms not URL
    //console.log("Email",email);

    if(
        [fullName,email,username,password].some((field)=>
            field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required");
    }

    const existedUser=await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User already exists");
    }

    //console.log(req.files); 

    const avatarLocalPath=req.files?.avatar[0]?.path;  //getting files from multer
    //const coverImageLocalPath=req.files?.coverImage[0]?.path;
    
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required");
    }


    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!avatar){
        throw new ApiError(500,"Failed to upload avatar");
    }

    const user=await User.create({
        fullName,
        email,
        username:username.toLowerCase(),
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || ""
    })

    const createdUser= await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser){
        throw new ApiError(500,"Failed to create user");
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User created successfully"
    ))
})

const loginUser=asyncHandler(async(req,res)=>{
    //user details from frontend, req body ->data
    //username or email
    //find user in database
    //password check
    //give access and refresh token
    //send cookies

    const {email, username, password}= req.body
    if(!username || !email){
        throw new ApiError(400,"Username or email is required");
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"User not found");
    }
    const isPasswordValid=await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid password");
    }

    const{accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);

    const logegdInUser= await User.findById(user._id).select("-password -refreshToken");

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(200,{
        user:logegdInUser,accessToken,refreshToken
    },"User logged in successfully");
})

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken:undefined
            }
        },
        {
            new : true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out"))
})    


export {registerUser,loginUser,logoutUser};