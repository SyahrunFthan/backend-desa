import { z } from "zod";
import { Op } from "sequelize";
import AssistanceCategory from "../models/AssistanceCategory.js";

const createAssistanceCategorySchema = z
  .object({
    name: z.string().nonempty("assistanceCategory.required.name"),
    type_assistance: z
      .string()
      .nonempty("assistanceCategory.required.type_assistance"),
    status: z.string().nonempty("assistanceCategory.required.status"),
    year: z.number().min(4, "assistanceCategory.required.year"),
  })
  .superRefine(async (data, ctx) => {
    const exists = await AssistanceCategory.findOne({
      where: {
        name: data.name,
        year: data.year,
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["name"],
        code: "custom",
        message: "assistanceCategory.unique.name",
      });
    }
  });

const updateAssistanceCategorySchema = z
  .object({
    name: z.string().nonempty("assistanceCategory.required.name"),
    type_assistance: z
      .string()
      .nonempty("assistanceCategory.required.type_assistance"),
    status: z.string().nonempty("assistanceCategory.required.status"),
    year: z.number().min(4, "assistanceCategory.required.year"),
    id: z.uuidv4(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await AssistanceCategory.findOne({
      where: {
        name: data.name,
        year: data.year,
        id: {
          [Op.ne]: data.id,
        },
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["name"],
        code: "custom",
        message: "assistanceCategory.unique.name",
      });
    }
  });

export { createAssistanceCategorySchema, updateAssistanceCategorySchema };
