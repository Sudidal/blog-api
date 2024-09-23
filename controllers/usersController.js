import { PrismaClient } from "@prisma/client";
import process from "node:process";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

class UsersController {
  constructor() {}

  async usersGetAll(req, res, next) {
    const users = await prisma.user.findMany({
      select: {
        username: true,
        email: true,
      },
    });
    res.json({ users });
  }
  async usersGetMe(req, res, next) {
    if (!req.headers.authorization) {
      res.status(404).json({ message: "No authorization header provided" });
    }
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;

    console.log(userId);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        username: true,
        email: true,
      },
    });
    res.json({ user });
  }
}

const usersController = new UsersController();
export default usersController;
