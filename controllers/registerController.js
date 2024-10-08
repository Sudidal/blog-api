import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../utils/asyncHandler.js";
import { validationResult, matchedData } from "express-validator";
import validationChains from "../validators/validationChains.js";

const prisma = new PrismaClient();

class RegisterController {
  constructor() {}

  registerPost = [
    validationChains.registerValidationChain(),
    async (req, res, next) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        console.log(validationErrors);
        return res.status(400).json({ errors: validationErrors.array() });
      }
      const validatedInput = matchedData(req);
      const hashedPassword = await bcrypt.hash(validatedInput.password, 10);
      const [result, err] = await asyncHandler.prismaQuery(() =>
        prisma.user.create({
          data: {
            username: validatedInput.username,
            password: hashedPassword,
            email: validatedInput.email,
            role: "USER",
          },
        })
      );
      if (err) {
        return next(err);
      }
      res.json({
        message: "Created account succesfully: " + validatedInput.username,
      });
    },
  ];
}

const registerController = new RegisterController();
export default registerController;
