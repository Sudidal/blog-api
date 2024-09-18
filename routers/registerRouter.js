import registerController from "../controllers/registerController.js";

const router = express.Router();

router.post("/", registerController.registerPost);

export { router as registerRouter };
