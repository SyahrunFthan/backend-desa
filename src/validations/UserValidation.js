import { z } from "zod";
import User from "../models/User.js";
import { Op } from "sequelize";

const userCreateSchema = z
  .object({
    email: z.string().email().nonempty("validation.required"),
    username: z.string().nonempty("validation.required"),
    resident_id: z.string().nonempty("validation.required"),
    role_id: z.string().nonempty("validation.required"),
  })
  .superRefine(async (data, ctx) => {
    const existing = await User.findAll({
      where: {
        [Op.or]: [
          { email: data.email },
          { username: data.username },
          { resident_id: data.resident_id },
        ],
      },
    });

    for (const user of existing) {
      if (user.email === data.email) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "validation.exists",
        });
      }
      if (user.username === data.username) {
        ctx.addIssue({
          path: ["username"],
          code: z.ZodIssueCode.custom,
          message: "validation.exists",
        });
      }

      if (user.resident_id === data.resident_id) {
        ctx.addIssue({
          path: ["resident_id"],
          code: z.ZodIssueCode.custom,
          message: "validation.exists",
        });
      }
    }
  });
const userUpdateSchema = z
  .object({
    email: z.string().email().nonempty("validation.required"),
    username: z.string().nonempty("validation.required"),
    role_id: z.string().nonempty("validation.required"),
    resident_id: z.string().nonempty("validation.required"),
    id: z.string().uuidv4("validation.uuid"),
  })
  .superRefine(async (data, ctx) => {
    const existing = await User.findAll({
      where: {
        [Op.or]: [{ email: data.email }, { username: data.username }],
        id: { [Op.ne]: data.id },
      },
    });

    for (const user of existing) {
      if (user.email === data.email) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "validation.exists",
        });
      }
      if (user.username === data.username) {
        ctx.addIssue({
          path: ["username"],
          code: z.ZodIssueCode.custom,
          message: "validation.exists",
        });
      }
    }

    const checkResident = await User.findOne({
      where: {
        resident_id: data.resident_id,
        id: {
          [Op.ne]: data.id,
        },
      },
    });

    if (checkResident) {
      ctx.addIssue({
        path: ["resident_id"],
        code: z.ZodIssueCode.custom,
        message: "validation.exists",
      });
    }
  });

export { userCreateSchema, userUpdateSchema };
