import { PrismaClient } from "@prisma/client";
import { validationResult, matchedData } from "express-validator";
import validationChains from "../validators/validationChains.js";
import permissions from "../permissions.js";

const prisma = new PrismaClient();

class PostsController {
  constructor() {}
  #postsLimit = 50;
  #commentsLimit = 50;
  userSelectOptions = {
    username: true,
    email: true,
    role: true,
  };

  postsGet = async (req, res, next) => {
    const posts = await prisma.post.findMany({
      where: {
        postStatus: "PUBLISHED",
      },
      include: {
        author: {
          select: this.userSelectOptions,
        },
        comments: {
          include: {
            user: {
              select: this.userSelectOptions,
            },
          },
        },
      },
      take: req.query.limit ? Number(req.query.limit) : this.#postsLimit,
    });
    this.#addPostPermissionProps(req.user, posts);
    res.json({ posts });
  };
  postsGetOne = async (req, res, next) => {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(req.params.postId),
        postStatus: "PUBLISHED",
      },
      include: {
        author: {
          select: this.userSelectOptions,
        },
        comments: {
          include: {
            user: {
              select: this.userSelectOptions,
            },
          },
        },
      },
    });
    this.#addPostPermissionProps(req.user, post);
    res.json({ post });
  };
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
          postStatus: req.body.publish ? "PUBLISHED" : "NOTPUBLISHED",
          publishDate: new Date().toISOString(),
          authorId: req.user.id,
        },
      });
      res.json("Post added succesfully: " + req.body.title);
    },
  ];

  postsDelete = async (req, res, next) => {
    await prisma.post.delete({
      where: {
        id: Number(req.params.postId),
      },
    });
    console.log("Deleted post: " + req.params.postId);
    res.json({ message: "Post deleted successfully" });
  };
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
          postStatus: req.body.publish ? "PUBLISHED" : "NOTPUBLISHED",
        },
      });
      res.json({ message: "Post updated successfully" });
    },
  ];

  postsLikePost = async (req, res, next) => {
    await prisma.post.update({
      where: {
        id: Number(req.params.postId),
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
    res.json({ message: "Post liked successfully" });
  };

  commentsGet = async (req, res, next) => {
    const comments = await prisma.comment.findMany({
      where: {
        postId: Number(req.params.postId),
      },
      include: {
        user: {
          select: this.userSelectOptions,
        },
      },
      take: req.query.limit ? Number(req.query.limit) : this.#commentsLimit,
    });
    this.#addCommentPermissionProps(req.user, comments);
    res.json({ comments });
  };
  commentsGetOne = async (req, res, next) => {
    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(req.params.commentId),
      },
      include: {
        user: {
          select: this.userSelectOptions,
        },
      },
    });
    this.#addCommentPermissionProps(req.user, comment);
    res.json({ comment });
  };
  commentsPost = [
    validationChains.commentValidationChain(),
    async (req, res, next) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        console.log(validationErrors);
        return res.status(400).json({ errors: validationErrors.array() });
      }
      const validatedData = matchedData(req);
      await prisma.comment.create({
        data: {
          content: validatedData.content,
          postId: Number(req.params.postId),
          userId: Number(req.user.id),
        },
      });
      res.json({ message: "Comment added successfully" });
    },
  ];

  commentsPut = [
    validationChains.commentValidationChain(),
    async (req, res, next) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        console.log(validationErrors);
        return res.status(400).json({ errors: validationErrors.array() });
      }
      const validatedData = matchedData(req);
      await prisma.comment.update({
        where: {
          id: Number(req.params.commentId),
        },
        data: {
          content: validatedData.content,
        },
      });
      res.json({ message: "Comment updated successfully" });
    },
  ];
  commentsLikePost = async (req, res, next) => {
    await prisma.comment.update({
      where: {
        id: Number(req.params.commentId),
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
    res.json({ message: "Comment liked successfully" });
  };
  commentsDelete = async (req, res, next) => {
    await prisma.comment.delete({
      where: {
        id: Number(req.params.commentId),
      },
    });
    res.json({ message: "Comment deleted successfully" });
  };

  async #addPostPermissionProps(user, postArr) {
    if (!Array.isArray(postArr)) {
      postArr = [postArr];
    }
    postArr.forEach(async (post) => {
      const editable = permissions.canEditThisPost(user, post);
      const deletable = permissions.canDeleteThisPost(user, post);
      post.editableByUser = editable;
      post.deletableByUser = deletable;
    });
  }
  async #addCommentPermissionProps(user, commentArr) {
    if (!Array.isArray(commentArr)) {
      commentArr = [commentArr];
    }
    commentArr.forEach(async (comment) => {
      const editable = permissions.canEditThisComment(user, comment);
      const deletable = permissions.canDeleteThisComment(user, comment);
      comment.editableByUser = editable;
      comment.deletableByUser = deletable;
    });
  }
}

const postsController = new PostsController();
export default postsController;
