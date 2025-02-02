import { Router } from "express";
import {registerUser,loginUser,logoutUser,refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory} from "../controllers/user.controller.js"; 
import {upload } from "../middlewares/multer.middleware.js";
import {veriyfJWT} from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(veriyfJWT,logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(veriyfJWT,changeCurrentPassword);

router.route("/current-user").get(veriyfJWT,getCurrentUser);

router.route("/update-account").patch(veriyfJWT,updateAccountDetails);

router.route("/update-avatar").patch(veriyfJWT,upload.single("avatar"),updateUserAvatar);

router.route("/update-cover-image").patch(veriyfJWT,upload.single("coverImage"),updateUserCoverImage);

router.route("/c/:username").get(veriyfJWT,getUserChannelProfile);

router.route("/history").get(veriyfJWT, getWatchHistory);


export default router;