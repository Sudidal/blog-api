import { PrismaClient } from "@prisma/client";

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
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
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
