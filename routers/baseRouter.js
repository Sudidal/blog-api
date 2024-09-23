import express from "express";
import passport from "passport";
import errorHandler from "../middleware/errorHandler.js";
import { registerRouter } from "./registerRouter.js";
import { loginRouter } from "./loginRouter.js";
import { postsRouter } from "./postsRouter.js";
import { notFoundRouter } from "./notFoundRouter.js";

const router = express.Router();

router.use("/register", registerRouter);
router.use("/login", loginRouter);
router.use(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  postsRouter
);
router.use("/*", notFoundRouter);

router.use(errorHandler);

export { router as baseRouter };
