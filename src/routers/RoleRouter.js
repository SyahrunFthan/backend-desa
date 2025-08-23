import express from "express";
import {
  destroy,
  index,
  store,
  update,
} from "../controllers/RoleController.js";
import Validation from "../middlewares/Validation.js";
import {
  roleCreateSchema,
  roleUpdateSchema,
} from "../validations/RoleValidation.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["superadmin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["superadmin"]),
  Validation(roleCreateSchema),
  store
);
router.put(
  "/:id",
  verifyToken,
  verifyRole(["superadmin"]),
  Validation(roleUpdateSchema),
  update
);
router.delete("/:id", verifyToken, verifyRole(["superadmin"]), destroy);

export default router;
