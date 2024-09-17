import express from "express";

const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Congrats, you are authorized");
});
router.post("/", (req, res, next) => {});

export { router as postsRouter };
