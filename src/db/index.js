import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB= async ()=>{
    try {
        const connnectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoBD connected !! ${connnectionInstance.connection.host}`);
    } catch (error) {
        console.log("ERROR",error);
        process.exit(1); //stidy more about this
    }
}

export default connectDB;