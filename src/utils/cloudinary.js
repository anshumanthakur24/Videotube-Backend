import { v2 as cloudinary } from "cloudinary";
//node js fs , standard node library for file handling
import fs from "fs";
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
}); 

const uploadOnCloudinary= async (localFilePath) =>{
    try {
        if (!localFilePath) {
            return  null;
        }
        //uplaod the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
        })
        //file has been uploaded on cloudinary
        //console.log("File uploaded successfully",response.url);
        return response;
        fs.unlinkSync(localFilePath) //remove the locally saved file as the upload was successful
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved file as the upload failed
    }
}

export {uploadOnCloudinary};