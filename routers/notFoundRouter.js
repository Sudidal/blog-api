import express from "express";
import loginController from "../controllers/loginController.js";

const router = express.Router();

router.use((req, res, next) => {
  res.status(404).json({ message: "404, Not Found!" });
});

export { router as notFoundRouter };
