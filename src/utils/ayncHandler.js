const asyncHandler = (requestHandler) => {
    (req, res, next) => {
    Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))}
};

export {asyncHandler}; // export the asyncHandler function



// const asyncHandler= (fn) => async (req,res,next)=>{    //this is try catch method type
//     try{
//         await fn(req,res,next);
//     } catch(error){
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     };
// }