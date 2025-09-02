import exress from "express";
import {
  destroy,
  getHistory,
  index,
  show,
  store,
  update,
  updateStatus,
} from "../controllers/SubmissionServiceConttoller.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";
import Validation from "../middlewares/Validation.js";
import {
  submissionServiceCreateSchema,
  submissionServiceUpdateSchema,
  submissionServiceUpdateStatusSchema,
} from "../validations/SubmissionServiceValidation.js";

const router = exress.Router();

router.get("/", verifyToken, verifyRole(["admin", "superadmin"]), index);
router.get(
  "/history",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  getHistory
);
router.get("/:id", verifyToken, verifyRole(["admin", "superadmin"]), show);
router.post(
  "/",
  // verifyToken,
  // verifyRole(["user"]),
  Validation(submissionServiceCreateSchema),
  store
);
router.patch(
  "/:id",
  verifyToken,
  verifyRole(["user"]),
  Validation(submissionServiceUpdateSchema),
  update
);
router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  Validation(submissionServiceUpdateStatusSchema),
  updateStatus
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin", "superadmin"]),
  destroy
);

export default router;
