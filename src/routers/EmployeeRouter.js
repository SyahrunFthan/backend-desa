import express from "express";
import {
  index,
  store,
  update,
  destroy,
} from "../controllers/EmployeeController.js";
import Validation from "../middlewares/Validation.js";
import verifyRole from "../middlewares/VerifyRole.js";
import verifyToken from "../middlewares/VerifyToken.js";
import {
  employeeCreateSchema,
  employeeUpdateSchema,
} from "../validations/EmployeeValidation.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin"]),
  Validation(employeeCreateSchema),
  store
);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  Validation(employeeUpdateSchema),
  update
);
router.delete("/:id", verifyToken, verifyRole(["admin"]), destroy);

export default router;
