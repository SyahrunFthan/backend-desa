import express from "express";
import {
  store,
  update,
  destroy,
  index,
} from "../controllers/DevelopmentController.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";
import Validation from "../middlewares/Validation.js";
import {
  developmentCreateSchema,
  developmentUpdateSchema,
} from "../validations/DevelopmentValidation.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin", "superadmin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  Validation(developmentCreateSchema),
  store
);
router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  Validation(developmentUpdateSchema),
  update
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  destroy
);

export default router;
