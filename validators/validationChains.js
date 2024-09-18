import { body } from "express-validator";
import customValidators from "./customValidators.js";
import validationVars from "./validationVars.js";

class ValidationChains {
  constructor() {}

  registerValidationChain = () => [
    body("username")
      .isString()
      .trim()
      .isLength({
        min: validationVars.username_min,
        max: validationVars.username_max,
      })
      .withMessage(
        `Username must be between ${validationVars.username_min} and ${validationVars.username_max} characters`
      )
      .bail()
      .custom(customValidators.isUsernameNotUsed)
      .withMessage("Username already in use"),
    body("email")
      .isEmail()
      .trim()
      .withMessage("Please enter a valid E-mail address")
      .bail()
      .custom(customValidators.isEmailNotUsed)
      .withMessage("E-mail already in use"),
    body("password")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Please enter a password"),
    body("confirm_password")
      .isString()
      .trim()
      .notEmpty()
      .custom(customValidators.isPasswordsMatch)
      .withMessage("Passwords do not match"),
  ];

  postValidationChain = () => [
    body("title")
      .isString()
      .trim()
      .isLength({
        min: validationVars.postTitle_min,
        max: validationVars.postTitle_max,
      })
      .withMessage(
        `Post title must be between ${validationVars.postTitle_min} and ${validationVars.postTitle_max}`
      ),
    body("content")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Post content can not be empty"),
  ];
  commentValidationChain = () => [
    body("content")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Comment can not be empty"),
  ];
}

const validationChains = new ValidationChains();
export default validationChains;
