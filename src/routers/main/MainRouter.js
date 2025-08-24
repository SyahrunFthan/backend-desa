import express from "express";
import { index } from "../../controllers/main/SocialAssistanceController.js";
import {
  getStatisticAgeGroup,
  getStatisticGender,
  getStatisticJob,
  getStatisticReligion,
  getStatisticResident,
} from "../../controllers/main/StatisticController.js";

const router = express.Router();

router.get("/social-assistance", index);
router.get("/statistic-resident", getStatisticResident);
router.get("/statistic-job", getStatisticJob);
router.get("/statistic-gender", getStatisticGender);
router.get("/statistic-religion", getStatisticReligion);
router.get("/statistic-age", getStatisticAgeGroup);

export default router;
