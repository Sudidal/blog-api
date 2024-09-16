import passport from "passport";
import localStrategy from "passport-local";
import jwtStrategy from "passport-jwt";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function configPassport() {
  passport.use(
    new localStrategy(async (username, password, done) => {
      const user = await prisma.user.findFirst({
        where: {
          username: username,
        },
      });
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
}

export { configPassport };
