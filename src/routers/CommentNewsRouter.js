import express from "express";
import { destroy } from "../controllers/CommentNewsController.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";

const router = express.Router();

router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin", "superadmin", "user"]),
  destroy
);

export default router;
