import { createRouter } from "../lib";
import auth from "./auth";
import health from "./health";

const router = createRouter().route("/", health).route("/auth", auth);

export default router;
