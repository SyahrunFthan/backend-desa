import express from "express";
import { login, logout, refreshToken } from "../controllers/AuthController.js";
import Validation from "../middlewares/Validation.js";
import { loginSchema } from "../validations/AuthValidation.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";

const router = express.Router();

router.post("/login", Validation(loginSchema), login);
router.get("/refresh-token", refreshToken);
router.delete("/logout", verifyToken, verifyRole(["admin", "user"]), logout);

export default router;
