import { z } from "zod";
import IncomingLetter from "../models/IncomingLetter.js";
import { Op } from "sequelize";

const incominLetterCreateSchema = z
  .object({
    code: z.string().nonempty("incomingLetters.code.required"),
    date_of_letter: z
      .string()
      .nonempty("incomingLetters.date_of_letter.required"),
    date_of_receipt: z
      .string()
      .nonempty("incomingLetters.date_of_letter.required"),
    sender: z.string().nonempty("incomingLetters.sender.required"),
    regarding: z.string().nonempty("incomingLetters.regarding.required"),
    status_letter: z
      .string()
      .nonempty("incomingLetters.status_letter.required"),
    file: z.custom(
      (file) => {
        if (!file) return false;
        return true;
      },
      {
        message: "incomingLetters.file.required",
      }
    ),
  })
  .superRefine(async (data, ctx) => {
    const exists = await IncomingLetter.findOne({
      where: {
        code: data.code,
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["code"],
        code: "custom",
        message: "incomingLetters.code.exists",
      });
    }
  });

const incominLetterUpdateSchema = z
  .object({
    code: z.string().nonempty("incomingLetters.code.required"),
    date_of_letter: z
      .string()
      .nonempty("incomingLetters.date_of_letter.required"),
    date_of_receipt: z
      .string()
      .nonempty("incomingLetters.date_of_letter.required"),
    sender: z.string().nonempty("incomingLetters.sender.required"),
    regarding: z.string().nonempty("incomingLetters.regarding.required"),
    status_letter: z
      .string()
      .nonempty("incomingLetters.status_letter.required"),
    id: z.string().optional(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await IncomingLetter.findOne({
      where: {
        code: data.code,
        id: {
          [Op.not]: data.id,
        },
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["code"],
        code: "custom",
        message: "incomingLetters.code.exists",
      });
    }
  });

export { incominLetterCreateSchema, incominLetterUpdateSchema };
