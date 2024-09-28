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
    let permissble = false;
    permissionObj.general.forEach((role) => {
      if (user.role === role) permissble = true;
    });
    if (permissble) {
      return true;
    } else {
      if (isOwner) {
        if (permissionObj.owned?.length) {
          permissionObj.owned.forEach((role) => {
            if (user.role === role) permissble = true;
          });
          if (permissble) {
            return true;
          }
        }
      }
    }
    return false;
  };

  #ownsThisPost = async (user, post) => {
    return post.authorId === user.id;
  };
  #ownsThisComment = async (user, comment) => {
    return comment.userId === user.id;
  };

  constructor() {}

  //-------- API
  canMakePosts = (user) => {
    return this.#checkPermission(user, this.#makePosts);
  };
  canMakeComments = (user) => {
    return this.#checkPermission(user, this.#makeComments);
  };
  canLikePosts = (user) => {
    return this.#checkPermission(user, this.#likePosts);
  };
  canLikeComments = (user) => {
    return this.#checkPermission(user, this.#likeComments);
  };
  canEditThisPost = (user, post) => {
    const isOwner = this.#ownsThisPost(user, post);
    const permissible = this.#checkPermission(user, this.#editPosts, isOwner);
    return permissible;
  };
  canDeleteThisPost = (user, post) => {
    const isOwner = this.#ownsThisPost(user, post);
    const permissible = this.#checkPermission(user, this.#deletePosts, isOwner);
    return permissible;
  };
  canEditThisComment = (user, comment) => {
    const isOwner = this.#ownsThisComment(user, comment);
    const permissible = this.#checkPermission(user, this.#editPosts, isOwner);
    return permissible;
  };
  canDeleteThisComment = (user, comment) => {
    const isOwner = this.#ownsThisComment(user, comment);
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
