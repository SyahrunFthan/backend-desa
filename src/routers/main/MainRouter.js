import express from "express";
import { index } from "../../controllers/main/SocialAssistanceController.js";
import {
  getStatisticJob,
  getStatisticResident,
} from "../../controllers/main/StatisticController.js";

const router = express.Router();

router.get("/social-assistance", index);
router.get("/statistic-resident", getStatisticResident);
router.get("/statistic-job", getStatisticJob);

export default router;
