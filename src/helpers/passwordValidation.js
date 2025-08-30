import { z } from "zod";

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

export default passwordSchema;
