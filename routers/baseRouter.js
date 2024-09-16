import { registerRouter } from "./registerRouter";
import { loginRouter } from "./loginRouter";
import { postsRouter } from "./postsRouter";

const router = express.Router();

router.post("/register", registerRouter);
router.get("/login", loginRouter);
router.get("/login", loginRouter);

export { router as baseRouter };
