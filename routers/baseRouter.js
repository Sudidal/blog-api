import express from "express";
import passport from "passport";
import { registerRouter } from "./registerRouter.js";
import { loginRouter } from "./loginRouter.js";
import { postsRouter } from "./postsRouter.js";
import { usersRouter } from "./usersRouter.js";
import { notFoundRouter } from "./notFoundRouter.js";

const router = express.Router();

router.use("/register", registerRouter);
router.use("/login", loginRouter);
router.use(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  postsRouter
);
router.use(
  "/users",
  passport.authenticate("jwt", { session: false }),
  usersRouter
);
router.use("/*", notFoundRouter);

export { router as baseRouter };
