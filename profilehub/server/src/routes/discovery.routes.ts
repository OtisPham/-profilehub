import { Router } from "express";
import { discoveryController } from "../controllers/discovery.controller.js";

const router = Router();

// Discovery Chat MVP Endpoints
router.post("/start", discoveryController.start);
router.post("/message", discoveryController.message);
router.post("/finish", discoveryController.finish);
router.get("/profile", discoveryController.getProfile);

export default router;
