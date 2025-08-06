import { z } from "zod";
import Period from "../models/Period.js";
import { Op } from "sequelize";

const periodCreateSchema = z
  .object({
    year: z.preprocess(
      (val) => (typeof val === "string" ? parseInt(val, 10) : val),
      z.number().min(1, "periods.year.required")
    ),
  })
  .superRefine(async (data, ctx) => {
    const exists = await Period.findOne({
      where: { year: data.year },
    });

    if (exists) {
      ctx.addIssue({
        path: ["year"],
        code: "custom",
        message: "periods.year.exists",
      });
    }
  });

const periodUpdateSchema = z
  .object({
    year: z.number().min(1, "periods.year.required"),
    id: z.uuidv4(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await Period.findOne({
      where: { year: data.year, id: { [Op.ne]: data.id } },
    });

    if (exists) {
      ctx.addIssue({
        path: ["year"],
        code: "custom",
        message: "periods.year.exists",
      });
    }
  });

export { periodCreateSchema, periodUpdateSchema };
