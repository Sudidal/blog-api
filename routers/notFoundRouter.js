import express from "express";

const router = express.Router();

router.use((req, res, next) => {
  return res.status(404).json({ message: "404, Not Found!" });
});

export { router as notFoundRouter };
