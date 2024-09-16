import { registerRouter } from "./registerRouter";
import { loginRouter } from "./loginRouter";
import { postsRouter } from "./postsRouter";

const router = express.Router();

router.post("/register", registerRouter);
router.get("/login", loginRouter);
router.get("/posts", postsRouter);

export { router as baseRouter };
