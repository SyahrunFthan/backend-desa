import express from "express";
import {
  index,
  store,
  update,
  destroy,
} from "../controllers/ActivityController.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";
import Validation from "../middlewares/Validation.js";
import {
  activityCreateSchema,
  activityUpdateSchema,
} from "../validations/ActivityValidation.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin", "superadmin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  Validation(activityCreateSchema),
  store
);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  Validation(activityUpdateSchema),
  update
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  destroy
);

export default router;
