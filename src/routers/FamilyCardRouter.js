import express from "express";
import {
  destroy,
  index,
  show,
  store,
  update,
} from "../controllers/FamilyCardController.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";
import Validation from "../middlewares/Validation.js";
import {
  familyCardCreateSchema,
  familyCardUpdateSchema,
} from "../validations/FamilyCardValidation.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin", "superadmin"]), index);
router.get("/:id", verifyToken, verifyRole(["admin", "superadmin"]), show);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  Validation(familyCardCreateSchema),
  store
);
router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  Validation(familyCardUpdateSchema),
  update
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  destroy
);

export default router;
