import express from "express";
import {
  destroy,
  index,
  store,
  update,
} from "../controllers/OutgoingLetterController.js";
import Validation from "../middlewares/Validation.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";
import {
  outgoingLetterCreateSchema,
  outgoingLetterUpdateSchema,
} from "../validations/OutgoingLetterValidation.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin"]),
  Validation(outgoingLetterCreateSchema),
  store
);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  Validation(outgoingLetterUpdateSchema),
  update
);
router.delete("/:id", verifyToken, verifyRole(["admin"]), destroy);

export default router;
