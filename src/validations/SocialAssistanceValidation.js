import { z } from "zod";
import { Op } from "sequelize";
import SocialAssistance from "../models/SocialAssistance.js";

const socialAssistanceCreateSchema = z
  .object({
    resident_id: z.string().nonempty("socialAssistance.required.resident_id"),
    assistance_id: z
      .string()
      .nonempty("socialAssistance.required.assistance_id"),
    status_assistance: z
      .string()
      .nonempty("socialAssistance.required.status_assistance"),
    month_of_aid: z.string().nonempty("socialAssistance.required.month_of_aid"),
    receipt_at: z.string().nonempty("socialAssistance.required.receipt_at"),
  })
  .superRefine(async (data, ctx) => {
    const exists = await SocialAssistance.findOne({
      where: {
        resident_id: data.resident_id,
        assistance_id: data.assistance_id,
        month_of_aid: data.month_of_aid,
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["resident_id"],
        code: "custom",
        message: "socialAssistance.unique.resident_id",
      });
    }
  });

const socialAssistanceUpdateSchema = z
  .object({
    resident_id: z.string().nonempty("socialAssistance.required.resident_id"),
    assistance_id: z
      .string()
      .nonempty("socialAssistance.required.assistance_id"),
    status_assistance: z
      .string()
      .nonempty("socialAssistance.required.status_assistance"),
    month_of_aid: z.string().nonempty("socialAssistance.required.month_of_aid"),
    receipt_at: z.string().nonempty("socialAssistance.required.receipt_at"),
    id: z.uuidv4(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await SocialAssistance.findOne({
      where: {
        resident_id: data.resident_id,
        assistance_id: data.assistance_id,
        id: {
          [Op.ne]: data.id,
        },
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["resident_id"],
        code: "custom",
        message: "socialAssistance.unique.resident_id",
      });
    }
  });

export { socialAssistanceCreateSchema, socialAssistanceUpdateSchema };
