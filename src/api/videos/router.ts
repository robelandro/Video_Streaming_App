import { Router } from "express";
import protect from "../../auth/protect";
import weakprotect from "../../auth/weakprotect";
import { uploadVideo, getVideoList, videoDelete, videoStream } from "./controller";
import { headerValidator, queryValidator, paramValidator } from "../../utils/validator";
import {
	videoHeaderVaildation, 
	videoQureyValidation,
	videoIdValidation
} from "./validation";


const router = Router();

// upload video
router.post(
	  "/upload",
	  protect,
	  headerValidator(videoHeaderVaildation),
	  uploadVideo
);

// get video
router.get(
	"/",
	protect,
	queryValidator(videoQureyValidation),
	getVideoList
);

// delete video and get
router.route("/:id")
.get(
	weakprotect,
	paramValidator(videoIdValidation),
	videoStream
)
.delete(
	protect,
	paramValidator(videoIdValidation),
	videoDelete
);

export default router
