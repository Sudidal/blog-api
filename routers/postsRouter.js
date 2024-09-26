import express from "express";
import postsController from "../controllers/postsController.js";

const router = express.Router();

// --------- Posts
router.get("/", postsController.postsGet);
router.post("/", postsController.postsPost);

router.get("/:postId", postsController.postsGetOne);
router.put("/:postId", postsController.postsPut);
router.delete("/:postId", postsController.postsDelete);
router.post("/:postId/like", postsController.postsLikePost);

// --------- Comments
router.get("/:postId/comments", postsController.commentsGet);
router.post("/:postId/comments", postsController.commentsPost);

router.get("/comments/:commentId", postsController.commentsGetOne);
router.put("/comments/:commentId", postsController.commentsPut);
router.delete("/comments/:commentId", postsController.commentsDelete);
router.post("/comments/:commentId/like", postsController.commentsLikePost);

export { router as postsRouter };
