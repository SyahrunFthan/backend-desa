import express from "express";
import {
  index,
  store,
  update,
  destroy,
} from "../controllers/AssistanceCategory.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";
import Validation from "../middlewares/Validation.js";
import {
  createAssistanceCategorySchema,
  updateAssistanceCategorySchema,
} from "../validations/AssistanceCategoryValidation.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin", "superadmin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  Validation(createAssistanceCategorySchema),
  store
);
router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  Validation(updateAssistanceCategorySchema),
  update
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  destroy
);

export default router;
