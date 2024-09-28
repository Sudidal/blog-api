import { PrismaClient } from "@prisma/client";
import asyncHandler from "../utils/asyncHandler.js";

const prisma = new PrismaClient();

class UsersController {
  constructor() {}

  async usersGetAll(req, res, next) {
    const [users, err] = await asyncHandler.prismaQuery(() =>
      prisma.user.findMany({
        select: {
          sdlfj: true,
          email: true,
          role: true,
        },
      })
    );
    if (err) {
      return next(err);
    }

    res.json({ users });
  }
  async usersGetMe(req, res, next) {
    const [user, err] = await asyncHandler.prismaQuery(() =>
      prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        select: {
          username: true,
          email: true,
          role: true,
        },
      })
    );
    if (err) {
      return next(err);
    }
    res.json({ user });
  }
}

const usersController = new UsersController();
export default usersController;
