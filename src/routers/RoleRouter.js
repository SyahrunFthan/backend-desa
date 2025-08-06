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

router.get("/", verifyToken, verifyRole(["admin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin"]),
  Validation(roleCreateSchema),
  store
);
router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  Validation(roleUpdateSchema),
  update
);
router.delete("/:id", verifyToken, verifyRole(["admin"]), destroy);

export default router;
