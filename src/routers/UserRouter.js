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

router.get("/", verifyToken, verifyRole(["superadmin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["superadmin"]),
  Validation(userCreateSchema),
  store
);
router.put(
  "/:id",
  verifyToken,
  verifyRole(["superadmin"]),
  Validation(userUpdateSchema),
  update
);
router.delete("/:id", verifyToken, verifyRole(["superadmin"]), destroy);

export default router;
