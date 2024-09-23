import express from "express";
import passport from "passport";
import { registerRouter } from "./registerRouter.js";
import { loginRouter } from "./loginRouter.js";
import { postsRouter } from "./postsRouter.js";

const router = express.Router();

router.use("/register", registerRouter);
router.use("/login", loginRouter);
router.use(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  postsRouter
);
router.all("/*", (req, res, next) => {
  res.status(404).json({ message: "404, Not Found!" });
});

export { router as baseRouter };
