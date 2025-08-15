import { z } from "zod";
import Tax from "../models/Tax.js";
import { Op } from "sequelize";

const taxCreateSchema = z
  .object({
    resident_id: z.string().nonempty("tax.required.resident_id"),
    reference_number: z.string().nonempty("tax.required.reference_number"),
    taxpayer_name: z.string().nonempty("tax.required.taxpayer_name"),
    taxpayer_address: z.string().nonempty("tax.required.taxpayer_address"),
    land_area: z.number().min(1, "tax.required.land_area"),
    building_area: z.number().min(1, "tax.required.building_area"),
    amount: z.number().min(1, "tax.required.amount"),
    status: z.string().nonempty("tax.required.status"),
  })
  .superRefine(async (data, ctx) => {
    const exists = await Tax.findOne({
      where: {
        reference_number: data.reference_number,
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["reference_number"],
        code: "custom",
        message: "tax.unique.reference_number",
      });
    }
  });

const taxUpdateSchema = z
  .object({
    resident_id: z.string().nonempty("tax.required.resident_id"),
    reference_number: z.string().nonempty("tax.required.reference_number"),
    taxpayer_name: z.string().nonempty("tax.required.taxpayer_name"),
    taxpayer_address: z.string().nonempty("tax.required.taxpayer_address"),
    land_area: z.number().min(1, "tax.required.land_area"),
    building_area: z.number().min(1, "tax.required.building_area"),
    amount: z.number().min(1, "tax.required.amount"),
    status: z.string().nonempty("tax.required.status"),
    id: z.uuidv4(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await Tax.findOne({
      where: {
        reference_number: data.reference_number,
        id: {
          [Op.ne]: data.id,
        },
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["reference_number"],
        code: "custom",
        message: "tax.unique.reference_number",
      });
    }
  });

export { taxCreateSchema, taxUpdateSchema };
