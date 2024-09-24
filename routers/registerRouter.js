import express from "express";
import registerController from "../controllers/registerController.js";

const router = express.Router();

router.post("/", registerController.registerPost);
router.get("/", (req, res, next) => {
  throw new Error("fuuuck");
});

export { router as registerRouter };
