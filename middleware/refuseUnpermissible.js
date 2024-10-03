import { PrismaClient } from "@prisma/client";
import asyncHandler from "../utils/asyncHandler.js";

const prisma = new PrismaClient();

function refuseUnpermissiblePostAction(permissionCheck) {
  return async (req, res, next) => {
    let post = null;
    if (req.params.postId) {
      let err = null;
      [post, err] = await asyncHandler.prismaQuery(() =>
        prisma.post.findUnique({
          where: {
            id: Number(req.params.postId),
          },
        })
      );
      if (err) {
        return next(err);
      }
    }
    const permissible = permissionCheck(req.user, post);
    if (!permissible) {
      return res
        .status(403)
        .json({ errors: "You are not allowed to do this action" });
    }
    next();
  };
}
function refuseUnpermissibleCommentAction(permissionCheck) {
  return async (req, res, next) => {
    let comment = null;
    if (req.params.commentId) {
      let err = null;
      [comment, err] = await asyncHandler.prismaQuery(() =>
        prisma.comment.findUnique({
          where: {
            id: Number(req.params.commentId),
          },
        })
      );
      if (err) {
        return next(err);
      }
    }
    const permissible = permissionCheck(req.user, comment);
    if (!permissible) {
      return res
        .status(403)
        .json({ errors: "You are not allowed to do this action" });
    }
    next();
  };
}

export { refuseUnpermissiblePostAction, refuseUnpermissibleCommentAction };
