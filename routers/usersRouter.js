import express from "express";
import usersController from "../controllers/usersController.js";

const router = express.Router();

router.get("/", usersController.usersGetAll);
router.get("/me", usersController.usersGetMe);

export { router as usersRouter };
