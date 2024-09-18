import express from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { validationResult, matchedData } from "express-validator";
import validationChains from "../validators/validationChains.js";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", (req, res, next) => {});
router.post("/", [
  validationChains.registerValidationChain(),
  async (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      console.log(validationErrors);
      return res.status(400).json({ errors: validationErrors.array() });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await prisma.user.create({
      data: {
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        role: "USER",
      },
    });
    res.json({ message: "Created account succesfully: " + req.body.username });
  },
]);

export { router as registerRouter };
