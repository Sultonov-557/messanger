import { createRouter } from "@/lib";
import { authMiddleware } from "@/lib/auth";

import { loginHandler, logoutHandler, meHandler, refreshHandler } from "./auth.handlers";
import { login, logout, me, refresh } from "./auth.routes";

const router = createRouter();

router.openapi(login, loginHandler);
router.openapi(refresh, refreshHandler);

router.use(logout.path, authMiddleware);
router.openapi(logout, logoutHandler);

router.use(me.path, authMiddleware);
router.openapi(me, meHandler);

export default router;
