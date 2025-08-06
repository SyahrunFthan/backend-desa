import express from "express";
import {
  store,
  update,
  destroy,
  index,
} from "../controllers/UserController.js";
import {
  userCreateSchema,
  userUpdateSchema,
} from "../validations/UserValidation.js";
import Validation from "../middlewares/Validation.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin"]),
  Validation(userCreateSchema),
  store
);
router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  Validation(userUpdateSchema),
  update
);
router.delete("/:id", verifyToken, verifyRole(["admin"]), destroy);

export default router;
