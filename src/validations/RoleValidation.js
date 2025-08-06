import { z } from "zod";
import Role from "../models/Role.js";
import { Op } from "sequelize";

const roleCreateSchema = z
  .object({
    name: z.string().nonempty("validation.required"),
    key: z.string().nonempty("validation.required"),
  })
  .superRefine(async (data, ctx) => {
    const existing = await Role.findOne({ where: { key: data.key } });
    if (existing) {
      ctx.addIssue({
        path: ["key"],
        code: z.ZodIssueCode.custom,
        message: "validation.unique",
      });
    }
  });
const roleUpdateSchema = z
  .object({
    name: z.string().nonempty("validation.required"),
    key: z.string().nonempty("validation.required"),
    id: z.string().uuidv4("validation.required"),
  })
  .superRefine(async (data, ctx) => {
    const role = await Role.findOne({
      where: { key: data.key, id: { [Op.ne]: data.id } },
    });

    if (role) {
      ctx.addIssue({
        path: ["key"],
        code: z.ZodIssueCode.custom,
        message: "validation.unique",
      });
    }
  });

export { roleCreateSchema, roleUpdateSchema };
