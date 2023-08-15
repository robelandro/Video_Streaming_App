import { Router } from "express";
import { bodyValidator } from "../../utils/validator";
import ratelimit from "../../auth/ratelimit";
import { userFiledVaildation } from "./validation"
import { createNewUser, loginUser, logoutUser } from "./controller";
import protect from "../../auth/protect";

const router = Router();

// New User
router.post(
	"/users",
	ratelimit,
	bodyValidator(userFiledVaildation),
	createNewUser,
);

// Login
router.post(
	"/login",
	ratelimit,
	bodyValidator(userFiledVaildation),
	loginUser
);

// logout
router.put(
	"/logout",
	protect,
	logoutUser
)

export default router
