import { PrismaClient } from "@prisma/client";
import { validationResult, matchedData } from "express-validator";
import validationChains from "../validators/validationChains.js";

const prisma = new PrismaClient();

class PostsController {
  constructor() {}

  async postsGet(req, res, next) {
    const posts = await prisma.post.findMany({
      where: {
        postStatus: "PUBLISHED",
      },
    });
    res.json({ posts });
  }
  postsPost = [
    validationChains.postValidationChain(),
    async (req, res, next) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        console.log(validationErrors);
        return res.status(400).json({ errors: validationErrors.array() });
      }
      const validatedInput = matchedData(req);
      await prisma.post.create({
        data: {
          title: validatedInput.title,
          content: validatedInput.content,
          postStatus: validatedInput.publish ? "PUBLISHED" : "NOTPUBLISHED",
          publishDate: new Date().toISOString(),
          authorId: req.user.id,
        },
      });
      res.json("Post added succesfully: " + req.body.title);
    },
  ];

  async postsDelete(req, res, next) {
    await prisma.post.delete({
      where: {
        id: Number(req.params.postId),
      },
    });
    console.log("Deleted post: " + req.params.postId);
    res.json({ message: "Post deleted successfully" });
  }
  postsPut = [
    validationChains.postValidationChain(),
    async (req, res, next) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        console.log(validationErrors);
        return res.status(400).json({ errors: validationErrors.array() });
      }
      const validatedInput = matchedData(req);
      await prisma.post.update({
        where: {
          id: Number(req.params.postId),
        },
        data: {
          title: validatedInput.title,
          content: validatedInput.content,
          postStatus: req.body.published ? "PUBLISHED" : "NOTPUBLISHED",
        },
      });
      res.json({ message: "Post updated successfully" });
    },
  ];
}

const postsController = new PostsController();
export default postsController;
