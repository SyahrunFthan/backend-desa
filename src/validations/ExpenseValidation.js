import { z } from "zod";
import Expense from "../models/Expense.js";
import { Op } from "sequelize";

const expenseCreateSchema = z
  .object({
    period_id: z.string().nonempty("expense.required.period_id"),
    code: z.string().nonempty("expense.required.code"),
    name: z.string().nonempty("expense.required.name"),
    funding_source_id: z
      .string()
      .nonempty("expense.required.funding_source_id"),
    is_main: z.boolean().nonoptional("expense.required.is_main"),
    volume: z.number().optional(),
    unit: z.number().optional(),
    amount: z.number().optional(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await Expense.findOne({
      where: {
        code: data.code,
        period_id: data.period_id,
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["code"],
        code: "custom",
        message: "expense.unique.code",
      });
    }

    if (data.volume === 0 && data.is_main === true) {
      ctx.addIssue({
        path: ["volume"],
        code: "custom",
        message: "expense.required.volume",
      });
    }

    if (data.unit === 0 && data.is_main === true) {
      ctx.addIssue({
        path: ["unit"],
        code: "custom",
        message: "expense.required.unit",
      });
    }

    if (data.amount === 0 && data.is_main === true) {
      ctx.addIssue({
        path: ["amount"],
        code: "custom",
        message: "expense.required.amount",
      });
    }
  });

const expenseUpdateSchema = z
  .object({
    period_id: z.string().nonempty("expense.required.period_id"),
    code: z.string().nonempty("expense.required.code"),
    name: z.string().nonempty("expense.required.name"),
    funding_source_id: z
      .string()
      .nonempty("expense.required.funding_source_id"),
    is_main: z.boolean().nonoptional("expense.required.is_main"),
    id: z.uuidv4(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await Expense.findOne({
      where: {
        code: data.code,
        period_id: data.period_id,
        id: { [Op.ne]: data.id },
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["code"],
        code: "custom",
        message: "expense.unique.code",
      });
    }
  });

export { expenseCreateSchema, expenseUpdateSchema };
