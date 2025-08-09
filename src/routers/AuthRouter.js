import express from "express";
import { login, logout, refreshToken } from "../controllers/AuthController.js";
import Validation from "../middlewares/Validation.js";
import { loginSchema } from "../validations/AuthValidation.js";
import verifyToken from "../middlewares/VerifyToken.js";

const router = express.Router();

router.post("/login", Validation(loginSchema), login);
router.get("/refresh-token", refreshToken);
router.delete("/logout", verifyToken, logout);

export default router;
