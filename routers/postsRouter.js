import express from "express";
import postsController from "../controllers/postsController.js";

const router = express.Router();

router.get("/", postsController.postsGet);
router.post("/", postsController.postsPost);

router.delete("/:postId", postsController.postsDelete);
router.put("/:postId", postsController.postsPut);

export { router as postsRouter };
