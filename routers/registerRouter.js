import express from "express";
import registerController from "../controllers/registerController.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  throw new Error("ahhhhh");
});
router.post("/", registerController.registerPost);

export { router as registerRouter };
