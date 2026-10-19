import { Router } from "express";
import * as notifications from "../controllers/notifications.controller";
import { requireAuth } from "../middleware/auth";
import { csrfProtection } from "../middleware/csrf";

export const notificationsRouter = Router();

// Push token registration and unregistration
notificationsRouter.post("/push-token", requireAuth, csrfProtection, notifications.registerPushToken);
notificationsRouter.delete("/push-token", requireAuth, csrfProtection, notifications.unregisterPushToken);
