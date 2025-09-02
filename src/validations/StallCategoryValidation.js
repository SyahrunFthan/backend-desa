import { z } from "zod";
import StallCategory from "../models/StallCategory.js";
import { Op } from "sequelize";

export const stallCategoryCreateSchema = z
  .object({
    name: z.string().nonempty("stallCategory.required.name"),
  })
  .superRefine(async (data, ctx) => {
    const exists = await StallCategory.findOne({
      where: {
        name: data.name,
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["name"],
        code: "custom",
        message: "stallCategory.unique.name",
      });
    }
  });
export const stallCategoryUpdateSchema = z
  .object({
    name: z.string().nonempty("stallCategory.required.name"),
    id: z.uuidv4(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await StallCategory.findOne({
      where: {
        name: data.name,
        id: {
          [Op.ne]: data.id,
        },
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["name"],
        code: "custom",
        message: "stallCategory.unique.name",
      });
    }
  });
