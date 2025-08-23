import express from "express";
import {
  index,
  store,
  update,
  destroy,
} from "../controllers/ServiceController.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";
import Validation from "../middlewares/Validation.js";
import {
  serviceCreateSchema,
  serviceUpdateSchema,
} from "../validations/ServiceValidation.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin", "superadmin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  Validation(serviceCreateSchema),
  store
);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  Validation(serviceUpdateSchema),
  update
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  destroy
);

export default router;
