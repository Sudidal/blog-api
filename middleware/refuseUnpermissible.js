import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function refuseUnpermissiblePostAction(permissionCheck) {
  return async (req, res, next) => {
    let post = null;
    if (req.params.postId) {
      post = await prisma.post.findUnique({
        where: {
          id: Number(req.params.postId),
        },
      });
    }
    const permissible = permissionCheck(req.user, post);
    if (!permissible) {
      return res
        .status(403)
        .json({ message: "You are not allowed to do this action" });
    }
    next();
  };
}
function refuseUnpermissibleCommentAction(permissionCheck) {
  return async (req, res, next) => {
    let comment = null;
    if (req.params.commentId) {
      comment = await prisma.comment.findUnique({
        where: {
          id: Number(req.params.commentId),
        },
      });
    }
    const permissible = permissionCheck(req.user, comment);
    if (!permissible) {
      return res
        .status(403)
        .json({ message: "You are not allowed to do this action" });
    }
    next();
  };
}

export { refuseUnpermissiblePostAction, refuseUnpermissibleCommentAction };
