import passport from "passport";
import jwt from "jsonwebtoken";
import process from "node:process";

class LoginController {
  constructor() {}

  loginPost = () => [
    passport.authenticate(
      "local",
      { session: false },
      function (err, user, info) {
        if (err || !user) {
          console.log(info);
          return res.status(400).json({ message: info.message });
        }
        req.login(user, { session: false }, (err) => {
          if (err) {
            console.log("couldn't login user");
            return res.json({ message: err });
          }
        });
        const token = jwt.sign(user, process.env.JWT_SECRET);
        return res.json({ user, token });
      }
    )(req, res, next),
  ];
}

const loginController = new LoginController();
export default loginController;
