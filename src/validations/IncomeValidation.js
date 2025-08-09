import { z } from "zod";
import Income from "../models/Income.js";
import { Op } from "sequelize";

const incomeCreateSchema = z
  .object({
    period_id: z.string().nonempty("incomes.required.period_id"),
    code: z.string().nonempty("incomes.required.code"),
    name: z.string().nonempty("incomes.required.name"),
    abbreviation: z.string().nonempty("incomes.required.abbreviation"),
    amount: z.number().min(1, "incomes.required.amount"),
  })
  .superRefine(async (data, ctx) => {
    const exists = await Income.findOne({
      where: {
        period_id: data.period_id,
        code: data.code,
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["code"],
        code: "custom",
        message: "incomes.code.exists",
      });
    }
  });

const incomeUpdateSchema = z
  .object({
    period_id: z.string().nonempty("incomes.required.period_id"),
    code: z.string().nonempty("incomes.required.code"),
    name: z.string().nonempty("incomes.required.name"),
    abbreviation: z.string().nonempty("incomes.required.abbreviation"),
    amount: z.number().min(1, "incomes.required.amount"),
    id: z.uuidv4(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await Income.findOne({
      where: {
        period_id: data.period_id,
        code: data.code,
        id: { [Op.ne]: data.id },
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["code"],
        code: "custom",
        message: "incomes.code.exists",
      });
    }
  });

export { incomeCreateSchema, incomeUpdateSchema };
