import { z } from "zod";
import Resident from "../models/Resident.js";
import { Op } from "sequelize";

const residentCreateSchema = z
  .object({
    resident_id: z
      .string()
      .min(16, "residents.resident_id.min")
      .nonempty("residents.resident_id.required"),
    family_card_id: z.string().nonempty("residents.family_card_id.required"),
    fullname: z.string().nonempty("residents.fullname.required"),
    gender: z.string().nonempty("residents.gender.required"),
    religion: z.string().nonempty("residents.religion.required"),
    citizen_status: z.string().nonempty("residents.citizen_status.required"),
    place_of_birth: z.string().nonempty("residents.place_of_birth.required"),
    date_of_birth: z.string().nonempty("residents.date_of_birth.required"),
    family_status: z.string().nonempty("residents.family_status.required"),
    profesion_status: z.preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean({ message: "residents.profesion_status.required" })),
    profesion: z.string().optional(),
    address: z.string().nonempty("residents.address.required"),
  })
  .superRefine(async (data, ctx) => {
    const exists = await Resident.findOne({
      where: {
        resident_id: data.resident_id,
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["resident_id"],
        code: z.ZodIssueCode.custom,
        message: "residents.resident_id.exists",
      });
    }

    if (
      data.profesion_status === true &&
      (!data.profesion || data.profesion.trim() === "")
    ) {
      ctx.addIssue({
        path: ["profesion"],
        code: z.ZodIssueCode.custom,
        message: "residents.profesion.required",
      });
    }
  });

const residentUpdateSchema = z
  .object({
    resident_id: z
      .string()
      .min(16, "residents.resident_id.min")
      .nonempty("residents.resident_id.required"),
    family_card_id: z.string().nonempty("residents.family_card_id.required"),
    fullname: z.string().nonempty("residents.fullname.required"),
    gender: z.string().nonempty("residents.gender.required"),
    religion: z.string().nonempty("residents.religion.required"),
    citizen_status: z.string().nonempty("residents.citizen_status.required"),
    place_of_birth: z.string().nonempty("residents.place_of_birth.required"),
    date_of_birth: z.string().nonempty("residents.date_of_birth.required"),
    family_status: z.string().nonempty("residents.family_status.required"),
    profesion_status: z.preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean({ message: "residents.profesion_status.required" })),
    profesion: z.string().optional(),
    address: z.string().nonempty("residents.address.required"),
    id: z.string().uuidv4(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await Resident.findOne({
      where: {
        resident_id: data.resident_id,
        id: {
          [Op.ne]: data.id,
        },
      },
    });

    if (exists) {
      ctx.addIssue({
        path: "resident_id",
        code: z.ZodIssueCode.custom,
        message: "residents.resident_id.exists",
      });
    }

    if (
      data.profesion_status &&
      (!data.profesion || data.profesion?.trim() === "")
    ) {
      ctx.addIssue({
        path: "profesion",
        code: z.ZodIssueCode.custom,
        message: "residents.profesion.required",
      });
    }
  });

export { residentCreateSchema, residentUpdateSchema };
