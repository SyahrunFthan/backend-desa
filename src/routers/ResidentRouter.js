import express from "express";
import {
  destroy,
  index,
  store,
  update,
} from "../controllers/ResidentController.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";
import Validation from "../middlewares/Validation.js";
import {
  residentCreateSchema,
  residentUpdateSchema,
} from "../validations/ResidentValidation.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin"]),
  Validation(residentCreateSchema),
  store
);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  Validation(residentUpdateSchema),
  update
);
router.delete("/:id", verifyToken, verifyRole(["admin"]), destroy);

export default router;
