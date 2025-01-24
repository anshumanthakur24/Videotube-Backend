import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app= express();  // max data comes from req.params or req.body
app.use(cors({                      //Allows cross-origin requests from the specified origin, enabling cookies and credentials.
      origin: process.env.CORS_ORIGIN,
      credentials: true
}))

app.use(express.json({limit: "16kb" }))  //Parses incoming JSON requests with a size limit of 16kb.
app.use(express.urlencoded({extended: true, limit: "16kb"})); // Parses URL-encoded requests (e.g., form submissions) with a size limit of 16kb, supporting nested objects.
app.use(express.static("public")); //Serves static files (e.g., HTML, CSS, JS) from the "public" directory.
app.use(cookieParser()); //Parses cookies attached to the client request object.








export {app}; // export the app object