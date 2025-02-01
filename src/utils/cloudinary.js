import { v2 as cloudinary } from "cloudinary";
import { error } from "console";
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
        fs.unlinkSync(localFilePath) //remove the locally saved file as the upload was successful

        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved file as the upload failed
    }
}

const deleteOldImage=async (oldImageUrl)=>{
    const response= await cloudinary.uploader.destroy(oldImageUrl);
    if(error){
        console.error("Error deleting old file", error);
    } else{
        console.log("Old File deleted successfully", response);
    }
}

export {uploadOnCloudinary,deleteOldImage};