// require("dotenv").config({path:"./.env"}); //well it is good enough to put it here
import mongoose, { connect } from "mongoose";
import {DB_NAME} from "./constants.js";

import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({path:"./.env"});
connectDB();




// import express from "express";

// const app = express();

// ( async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error",()=>{
//             console.log("ERROR:",error);
//             throw error;
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on PORT:${process.env.PORT}`)});

//     } catch (error) {
//         console.log("ERROR",error);
//         throw error;
//     }
// })() // IIFEimmediately invoked function expression