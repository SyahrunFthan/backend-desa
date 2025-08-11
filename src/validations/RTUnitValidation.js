import { z } from "zod";
import RTUnit from "../models/RTUnit.js";
import { Op } from "sequelize";

const rtUnitCreateSchema = z
  .object({
    name_of_chairman: z.string().nonempty("rt_unit.required.name_of_chairman"),
    code: z.string().nonempty("rt_unit.required.code"),
    rw_id: z.string().nonempty("rt_unit.required.rw_id"),
  })
  .superRefine(async (data, ctx) => {
    const exists = await RTUnit.findOne({
      where: {
        code: data.code,
        rw_id: data.rw_id,
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["code"],
        code: "custom",
        message: "rt_unit.unique.code",
      });
    }
  });
const rtUnitUpdateSchema = z
  .object({
    name_of_chairman: z.string().nonempty("rt_unit.required.name_of_chairman"),
    code: z.string().nonempty("rt_unit.required.code"),
    rw_id: z.string().nonempty("rt_unit.required.rw_id"),
    id: z.uuidv4(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await RTUnit.findOne({
      where: {
        code: data.code,
        rw_id: data.rw_id,
        id: {
          [Op.ne]: data.id,
        },
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["code"],
        code: "custom",
        message: "rt_unit.unique.code",
      });
    }
  });

export { rtUnitCreateSchema, rtUnitUpdateSchema };
