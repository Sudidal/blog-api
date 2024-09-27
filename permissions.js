import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class Permissions {
  //-------- Constants
  #USER = "USER";
  #AUTHOR = "AUTHOR";
  #ADMIN = "ADMIN";

  //-------- permissions
  #likePosts = { general: [this.#ADMIN, this.#AUTHOR, this.#USER] };
  #likeComments = { general: [this.#ADMIN, this.#AUTHOR, this.#USER] };
  #makePosts = { general: [this.#ADMIN, this.#AUTHOR] };
  #makeComments = {
    general: [this.#ADMIN, this.#AUTHOR, this.#USER],
  };
  #editPosts = {
    general: [this.#ADMIN],
    owned: [this.#AUTHOR],
  };
  #deletePosts = {
    general: [this.#ADMIN],
    owned: [this.#AUTHOR],
  };
  #deleteComments = {
    general: [this.#ADMIN],
    owned: [this.#AUTHOR, this.#USER],
  };

  //-------- Checks
  #isUser = (user) => user.role === this.#USER;
  #isAdmin = (user) => user.role === this.#ADMIN;
  #isAuthor = (user) => user.role === this.#AUTHOR;

  //-------- Helper functions
  #checkPermission = (user, permissionObj, isOwner = false) => {
    let legible = false;
    permissionObj.general.forEach((role) => {
      if (user.role === role) legible = true;
    });
    if (legible) {
      return true;
    } else {
      if (isOwner) {
        if (permissionObj.owned?.length) {
          permissionObj.owned.forEach((role) => {
            if (user.role === role) legible = true;
          });
          if (legible) {
            return true;
          }
        }
      }
    }
    return false;
  };

  #ownsThisPost = async (user, postId) => {
    const post = await this.#getPostById(postId);
    return post.authorId === user.id;
  };
  #ownsThisComment = async (user, commentId) => {
    const comment = await this.#getCommentById(commentId);
    return comment.userId === user.id;
  };

  #getPostById = async (postId) => {
    try {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      return post;
    } catch (err) {
      // call next() somehow
      throw new Error(err);
    }
  };
  #getCommentById = async (commentId) => {
    try {
      const comment = await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });
      return comment;
    } catch (err) {
      // call next() somehow
      throw new Error(err);
    }
  };

  constructor() {}

  //-------- API
  canMakePosts = async (user) => {
    return this.#checkPermission(user, this.#makePosts);
  };
  canMakeComments = (user) => {
    const general = this.#checkPermission(user, this.#makeComments);
  };
  canEditThisPost = async (user, postId) => {
    const isOwner = await this.#ownsThisPost(user, postId);
    const permissible = this.#checkPermission(user, this.#editPosts, isOwner);
    return permissible;
  };
  canDeleteThisComment = async (user, commentId) => {
    const isOwner = await this.#ownsThisComment(user, commentId);
    const permissible = this.#checkPermission(
      user,
      this.#deleteComments,
      isOwner
    );
    return permissible;
  };
}

const permissions = new Permissions();
export default permissions;
