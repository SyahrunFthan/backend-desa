import { z } from "zod";
import FamilyCard from "../models/FamilyCard.js";
import { Op } from "sequelize";

const familyCardCreateSchema = z
  .object({
    family_id: z
      .string()
      .min(16, { message: "familyCard.family_id.min" })
      .nonempty("familyCard.family_id.required"),
    address: z.string().nonempty("familyCard.address.required"),
    total_family: z
      .number()
      .min(1, { message: "familyCard.total_family.required" }),
  })
  .superRefine(async (data, ctx) => {
    const family = await FamilyCard.findOne({
      where: { family_id: data.family_id },
    });

    if (family) {
      ctx.addIssue({
        path: "family_id",
        code: z.ZodIssueCode.custom,
        message: "familyCard.family_id.exists",
      });
    }
  });

const familyCardUpdateSchema = z
  .object({
    id: z.string().uuidv4(),
    family_id: z
      .string()
      .min(16, { message: "familyCard.family_id.min" })
      .nonempty("familyCard.family_id.required"),
    address: z.string().nonempty("familyCard.address.required"),
    total_family: z
      .number()
      .min(1, { message: "familyCard.total_family.required" }),
  })
  .superRefine(async (data, ctx) => {
    const family = await FamilyCard.findOne({
      where: { family_id: data.family_id, id: { [Op.ne]: data.id } },
    });

    if (family) {
      ctx.addIssue({
        path: "family_id",
        code: z.ZodIssueCode.custom,
        message: "familyCard.family_id.exists",
      });
    }
  });

export { familyCardCreateSchema, familyCardUpdateSchema };
