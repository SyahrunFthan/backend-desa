import express from "express";
import {
  index,
  store,
  destroy,
  update,
} from "../controllers/PeriodController.js";
import Validation from "../middlewares/Validation.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";
import {
  periodCreateSchema,
  periodUpdateSchema,
} from "../validations/PeriodValidation.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin"]),
  Validation(periodCreateSchema),
  store
);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  Validation(periodUpdateSchema),
  update
);
router.delete("/:id", verifyToken, verifyRole(["admin"]), destroy);

export default router;
