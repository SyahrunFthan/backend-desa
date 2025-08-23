import express from "express";
import { index, store, update, destroy } from "../controllers/TaxController.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";
import Validation from "../middlewares/Validation.js";
import {
  taxCreateSchema,
  taxUpdateSchema,
} from "../validations/TaxValidation.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin", "superadmin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  Validation(taxCreateSchema),
  store
);
router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  Validation(taxUpdateSchema),
  update
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  destroy
);

export default router;
