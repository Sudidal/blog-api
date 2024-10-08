import passport from "passport";
import jwt from "jsonwebtoken";
import process from "node:process";

class LoginController {
  constructor() {}

  loginPost(req, res, next) {
    passport.authenticate(
      "local",
      { session: false },
      function (err, user, info) {
        if (err || !user) {
          console.log(info);
          return res.status(400).json({ errors: info.message });
        }
        req.login(user, { session: false }, (err) => {
          if (err) {
            console.log("err");
            return res.status(500).json({ errors: "Couldn't login user" });
          }
        });
        const token = jwt.sign(user, process.env.JWT_SECRET);
        return res.json({ message: "Login successfull", jwtToken: token });
      }
    )(req, res, next);
  }
}

const loginController = new LoginController();
export default loginController;
