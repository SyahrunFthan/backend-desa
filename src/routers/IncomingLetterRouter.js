import express from "express";
import {
  index,
  store,
  update,
  destroy,
} from "../controllers/IncomingLetterController.js";
import Validation from "../middlewares/Validation.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";
import {
  incominLetterCreateSchema,
  incominLetterUpdateSchema,
} from "../validations/IncomingLetterValidation.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin"]),
  Validation(incominLetterCreateSchema),
  store
);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  Validation(incominLetterUpdateSchema),
  update
);
router.delete("/:id", verifyToken, verifyRole(["admin"]), destroy);

export default router;
