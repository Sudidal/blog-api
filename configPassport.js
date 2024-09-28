import passport from "passport";
import localStrategy from "passport-local";
import passportJwt from "passport-jwt";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "./utils/asyncHandler.js";
import process from "node:process";

const prisma = new PrismaClient();

function configPassport() {
  passport.use(
    new localStrategy(async (username, password, done) => {
      const [user, err] = await asyncHandler.prismaQuery(() =>
        prisma.user.findFirst({
          where: {
            username: username,
          },
        })
      );
      if (err) {
        return next(err);
      }
      if (!user) {
        return done(null, false, { message: "Username does not exist" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect username or password" });
      }
      return done(null, user);
    })
  );
  passport.use(
    new passportJwt.Strategy(
      {
        jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      (jwtPayload, done) => {
        done(null, jwtPayload);
      }
    )
  );
}

export { configPassport };
