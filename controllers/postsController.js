import { PrismaClient } from "@prisma/client";
import asyncHandler from "../utils/asyncHandler.js";
import { validationResult, matchedData } from "express-validator";
import validationChains from "../validators/validationChains.js";
import permissions from "../permissions.js";
import {
  refuseUnpermissiblePostAction,
  refuseUnpermissibleCommentAction,
} from "../middleware/refuseUnpermissible.js";

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
    const [posts, err] = await asyncHandler.prismaQuery(() =>
      prisma.post.findMany({
        where: {
          postStatus: "PUBLISHED",
        },
        include: {
          author: {
            select: this.userSelectOptions,
          },
          comments: {
            orderBy: {
              id: "desc",
            },
            include: {
              user: {
                select: this.userSelectOptions,
              },
            },
          },
        },
        orderBy: {
          id: "desc",
        },
        take: req.query.limit ? Number(req.query.limit) : this.#postsLimit,
      })
    );
    if (err) {
      return next(err);
    }

    this.#addPostPermissionProps(req.user, posts);
    res.json({ posts });
  };
  postsGetOne = async (req, res, next) => {
    const [post, err] = await asyncHandler.prismaQuery(() =>
      prisma.post.findUnique({
        where: {
          id: Number(req.params.postId),
          postStatus: "PUBLISHED",
        },
        include: {
          author: {
            select: this.userSelectOptions,
          },
          comments: {
            orderBy: {
              id: "desc",
            },
            include: {
              user: {
                select: this.userSelectOptions,
              },
            },
          },
        },
      })
    );
    if (err) {
      return next(err);
    }

    this.#addPostPermissionProps(req.user, post);
    res.json({ post });
  };
  postsPost = [
    refuseUnpermissiblePostAction(permissions.canMakePosts),
    validationChains.postValidationChain(),
    async (req, res, next) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        console.log(validationErrors);
        return res.status(400).json({ errors: validationErrors.array() });
      }
      const validatedInput = matchedData(req);
      const [result, err] = await asyncHandler.prismaQuery(() =>
        prisma.post.create({
          data: {
            title: validatedInput.title,
            content: validatedInput.content,
            postStatus: req.body.publish ? "PUBLISHED" : "NOTPUBLISHED",
            publishDate: new Date().toISOString(),
            authorId: req.user.id,
          },
        })
      );
      if (err) {
        return next(err);
      }

      res.json("Post added succesfully: " + req.body.title);
    },
  ];
  postsDelete = [
    refuseUnpermissiblePostAction(permissions.canDeleteThisPost),
    async (req, res, next) => {
      const [result, err] = await asyncHandler.prismaQuery(() =>
        prisma.post.delete({
          where: {
            id: Number(req.params.postId),
          },
        })
      );
      if (err) {
        return next(err);
      }

      console.log("Deleted post: " + req.params.postId);
      res.json({ message: "Post deleted successfully" });
    },
  ];
  postsPut = [
    refuseUnpermissiblePostAction(permissions.canEditThisPost),
    validationChains.postValidationChain(),
    async (req, res, next) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        console.log(validationErrors);
        return res.status(400).json({ errors: validationErrors.array() });
      }
      const validatedInput = matchedData(req);
      const [result, err] = await asyncHandler.prismaQuery(() =>
        prisma.post.update({
          where: {
            id: Number(req.params.postId),
          },
          data: {
            title: validatedInput.title,
            content: validatedInput.content,
            postStatus: req.body.publish ? "PUBLISHED" : "NOTPUBLISHED",
          },
        })
      );
      if (err) {
        return next(err);
      }
      res.json({ message: "Post updated successfully" });
    },
  ];

  postsLikePost = [
    refuseUnpermissiblePostAction(permissions.canLikeComments),
    async (req, res, next) => {
      const [result, err] = await asyncHandler.prismaQuery(() =>
        prisma.post.update({
          where: {
            id: Number(req.params.postId),
          },
          data: {
            likes: {
              increment: 1,
            },
          },
        })
      );
      if (err) {
        return next(err);
      }
      res.json({ message: "Post liked successfully" });
    },
  ];

  commentsGet = async (req, res, next) => {
    const [comments, err] = await asyncHandler.prismaQuery(() =>
      prisma.comment.findMany({
        where: {
          postId: Number(req.params.postId),
        },
        include: {
          user: {
            select: this.userSelectOptions,
          },
        },
        orderBy: {
          id: "desc",
        },
        take: req.query.limit ? Number(req.query.limit) : this.#commentsLimit,
      })
    );
    if (err) {
      return next(err);
    }
    this.#addCommentPermissionProps(req.user, comments);
    res.json({ comments });
  };
  commentsGetOne = async (req, res, next) => {
    const [comment, err] = await asyncHandler.prismaQuery(() =>
      prisma.comment.findUnique({
        where: {
          id: Number(req.params.commentId),
        },
        include: {
          user: {
            select: this.userSelectOptions,
          },
        },
      })
    );
    if (err) {
      return next(err);
    }
    this.#addCommentPermissionProps(req.user, comment);
    res.json({ comment });
  };
  commentsPost = [
    refuseUnpermissibleCommentAction(permissions.canMakeComments),
    validationChains.commentValidationChain(),
    async (req, res, next) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        console.log(validationErrors);
        return res.status(400).json({ errors: validationErrors.array() });
      }
      const validatedData = matchedData(req);
      const [result, err] = await asyncHandler.prismaQuery(() =>
        prisma.comment.create({
          data: {
            content: validatedData.content,
            publishDate: new Date().toISOString(),
            postId: Number(req.params.postId),
            userId: Number(req.user.id),
          },
        })
      );
      if (err) {
        return next(err);
      }
      res.json({ message: "Comment added successfully" });
    },
  ];

  commentsPut = [
    refuseUnpermissibleCommentAction(permissions.canEditThisComment),
    validationChains.commentValidationChain(),
    async (req, res, next) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        console.log(validationErrors);
        return res.status(400).json({ errors: validationErrors.array() });
      }
      const validatedData = matchedData(req);
      const [result, err] = await asyncHandler.prismaQuery(() =>
        prisma.comment.update({
          where: {
            id: Number(req.params.commentId),
          },
          data: {
            content: validatedData.content,
          },
        })
      );
      if (err) {
        return next(err);
      }
      res.json({ message: "Comment updated successfully" });
    },
  ];

  commentsLikePost = [
    refuseUnpermissibleCommentAction(permissions.canLikeComments),
    async (req, res, next) => {
      const [result, err] = await asyncHandler.prismaQuery(() =>
        prisma.comment.update({
          where: {
            id: Number(req.params.commentId),
          },
          data: {
            likes: {
              increment: 1,
            },
          },
        })
      );
      if (err) {
        return next(err);
      }
      res.json({ message: "Comment liked successfully" });
    },
  ];
  commentsDelete = [
    refuseUnpermissibleCommentAction(permissions.canDeleteThisComment),
    async (req, res, next) => {
      const [result, err] = await asyncHandler.prismaQuery(() =>
        prisma.comment.delete({
          where: {
            id: Number(req.params.commentId),
          },
        })
      );
      if (err) {
        return next(err);
      }
      res.json({ message: "Comment deleted successfully" });
    },
  ];

  async #addPostPermissionProps(user, postArr) {
    if (!postArr) return;
    if (!Array.isArray(postArr)) {
      postArr = [postArr];
    }
    postArr.forEach(async (post) => {
      const editable = permissions.canEditThisPost(user, post);
      const deletable = permissions.canDeleteThisPost(user, post);
      post.editableByUser = editable;
      post.deletableByUser = deletable;
      this.#addCommentPermissionProps(user, post.comments);
    });
  }
  async #addCommentPermissionProps(user, commentArr) {
    if (!commentArr) return;
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
