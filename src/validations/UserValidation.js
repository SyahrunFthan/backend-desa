import { z } from "zod";
import User from "../models/User.js";
import { Op, where } from "sequelize";
import bcrypt from "bcryptjs";

const passwordSchema = z.string().superRefine((val, ctx) => {
  if (!val || val.trim() === "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "validation.required",
    });
    return;
  }

  if (val.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 8,
      type: "string",
      inclusive: true,
      message: "validation.password.min",
    });
  }

  if (!/[A-Z]/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "validation.password.uppercase",
    });
  }

  if (!/[a-z]/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "validation.password.lowercase",
    });
  }

  if (!/\d/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "validation.password.number",
    });
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "validation.password.symbol",
    });
  }
});

const userCreateSchema = z
  .object({
    email: z.string().email().nonempty("validation.required"),
    username: z.string().nonempty("validation.required"),
    password: passwordSchema,
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
