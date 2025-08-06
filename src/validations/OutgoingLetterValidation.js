import { z } from "zod";
import OutgoingLetter from "../models/OutgoingLetter.js";
import { Op } from "sequelize";

const outgoingLetterCreateSchema = z
  .object({
    code: z.string().nonempty("outgoingLetters.code.required"),
    date_of_letter: z
      .string()
      .nonempty("outgoingLetters.date_of_letter.required"),
    objective: z.string().nonempty("outgoingLetters.objective.required"),
    regarding: z.string().nonempty("outgoingLetters.regarding.required"),
    status_letter: z
      .string()
      .nonempty("outgoingLetters.status_letter.required"),
    file: z.custom(
      (file) => {
        if (!file) return false;
        return true;
      },
      {
        message: "outgoingLetters.file.required",
      }
    ),
  })
  .superRefine(async (data, ctx) => {
    const exists = await OutgoingLetter.findOne({
      where: {
        code: data.code,
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["code"],
        code: "custom",
        message: "outgoingLetters.code.exists",
      });
    }
  });

const outgoingLetterUpdateSchema = z
  .object({
    code: z.string().nonempty("outgoingLetters.code.required"),
    date_of_letter: z
      .string()
      .nonempty("outgoingLetters.date_of_letter.required"),
    objective: z.string().nonempty("outgoingLetters.objective.required"),
    regarding: z.string().nonempty("outgoingLetters.regarding.required"),
    status_letter: z
      .string()
      .nonempty("outgoingLetters.status_letter.required"),
    id: z.uuidv4(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await OutgoingLetter.findOne({
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
        message: "outgoingLetters.code.exists",
      });
    }
  });

export { outgoingLetterCreateSchema, outgoingLetterUpdateSchema };
