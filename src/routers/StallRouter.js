import express from "express";
import {
  destroy,
  index,
  store,
  update,
} from "../controllers/StallController.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";
import Validation from "../middlewares/Validation.js";
import {
  stallCreateSchema,
  stallUpdateSchema,
} from "../validations/StallValidation.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin", "superadmin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["user"]),
  Validation(stallCreateSchema),
  store
);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["user"]),
  Validation(stallUpdateSchema),
  update
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin", "user", "superadmin"]),
  destroy
);

export default router;
