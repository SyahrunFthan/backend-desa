import { z } from "zod";
import RWUnit from "../models/RWUnit.js";
import { Op } from "sequelize";

const rwUnitCreateSchema = z
  .object({
    code: z.string().nonempty("rw_unit.required.code"),
    name_of_chairman: z.string().nonempty("rw_unit.required.name_of_chairman"),
  })
  .superRefine(async (data, ctx) => {
    const exists = await RWUnit.findOne({
      where: {
        code: data.code,
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["code"],
        code: "custom",
        message: "rw_unit.unique.code",
      });
    }
  });

const rwUnitUpdateSchema = z
  .object({
    code: z.string().nonempty("rw_unit.required.code"),
    name_of_chairman: z.string().nonempty("rw_unit.required.name_of_chairman"),
    id: z.uuidv4(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await RWUnit.findOne({
      where: {
        code: data.code,
        id: {
          [Op.ne]: data.id,
        },
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["code"],
        code: "custom",
        message: "rw_unit.unique.code",
      });
    }
  });

export { rwUnitCreateSchema, rwUnitUpdateSchema };
