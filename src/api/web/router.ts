import { Router } from "express";
import webProtect from "../../auth/webProtect";
import { mainPage } from "./controller";

const router = Router();

// serving the web
router.get("/", webProtect, mainPage)

export default router
