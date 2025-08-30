import express from "express";
import {
  store,
  index,
  updateLogo,
  updateImage,
  updateVissionAndMission,
  updateAboutAndHistory,
} from "../controllers/VillageController.js";
import verifyToken from "../middlewares/VerifyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["superadmin"]), index);
router.post("/", verifyToken, verifyRole(["superadmin"]), store);
router.patch(
  "/update/logo/:id",
  verifyToken,
  verifyRole(["superadmin", "admin"]),
  updateLogo
);
router.patch(
  "/update/image/:id",
  verifyToken,
  verifyRole(["superadmin", "admin"]),
  updateImage
);
router.put(
  "/update/vission/:id",
  verifyToken,
  verifyRole(["superadmin", "admin"]),
  updateVissionAndMission
);
router.put(
  "/update/about/:id",
  verifyToken,
  verifyRole(["superadmin", "admin"]),
  updateAboutAndHistory
);

export default router;
