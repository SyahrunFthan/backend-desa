import express from "express";
import {
  index,
  store,
  update,
  destroy,
} from "../controllers/IncomeController.js";
import Validation from "../middlewares/Validation.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";
import {
  incomeCreateSchema,
  incomeUpdateSchema,
} from "../validations/IncomeValidation.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin"]),
  Validation(incomeCreateSchema),
  store
);
router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  Validation(incomeUpdateSchema),
  update
);
router.delete("/:id", verifyToken, verifyRole(["admin"]), destroy);

export default router;
