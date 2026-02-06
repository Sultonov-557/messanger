import { createRouter } from "@/lib";

import {
  registerHandler,
  loginHandler,
  logoutHandler,
  meHandler,
  refreshHandler,
  updateHandler,
} from "./auth.handlers";
import { register,login, logout, me, refresh, update } from "./auth.routes";

const router = createRouter();

router.openapi(register, registerHandler);
router.openapi(login, loginHandler);
router.openapi(refresh, refreshHandler);
router.openapi(logout, logoutHandler);
router.openapi(me, meHandler);
router.openapi(update, updateHandler);

export default router;
