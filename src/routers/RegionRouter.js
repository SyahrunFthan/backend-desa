import express from "express";
import {
  store,
  update,
  destroy,
  index,
} from "../controllers/RegionController.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";
import Validation from "../middlewares/Validation.js";
import {
  regionCreateSchema,
  regionUpdateSchema,
} from "../validations/RegionValidation.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin"]), index);
router.post(
  "/",
  verifyToken,
  verifyRole(["admin"]),
  Validation(regionCreateSchema),
  store
);
router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  Validation(regionUpdateSchema),
  update
);
router.delete("/:id", verifyToken, verifyRole(["admin"]), destroy);

export default router;
