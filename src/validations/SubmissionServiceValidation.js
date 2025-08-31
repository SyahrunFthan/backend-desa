import { z } from "zod";
import Resident from "../models/Resident.js";

export const submissionServiceCreateSchema = z
  .object({
    service_id: z.uuidv4().nonempty("submissionService.required.service_id"),
    resident_id: z.string().nonempty("submissionService.required.resident_id"),
    file: z.custom(
      (file) => {
        if (!file) return false;
        return true;
      },
      {
        message: "submissionService.file.required",
      }
    ),
  })
  .superRefine(async (data, ctx) => {
    const existsResident = await Resident.findOne({
      where: {
        resident_id: data.resident_id,
      },
    });

    if (!existsResident) {
      ctx.addIssue({
        path: ["resident_id"],
        code: "custom",
        message: "submissionService.notFound.resident_id",
      });
    }
  });

export const submissionServiceUpdateSchema = z.object({
  service_id: z.uuidv4().nonempty("submissionService.required.service_id"),
});

export const submissionServiceUpdateStatusSchema = z
  .object({
    status_submission: z.string().nonempty("submissionService.required.status"),
    code: z.string().trim().nullish(),
    note: z.string().trim().nullish(),
  })
  .superRefine((data, ctx) => {
    if (data.status_submission === "rejected" && !data.note) {
      ctx.addIssue({
        code: "custom",
        message: "submissionService.required.note",
        path: ["note"],
      });
    }
    if (data.status_submission === "approved" && !data.code) {
      ctx.addIssue({
        code: "custom",
        message: "submissionService.required.code",
        path: ["code"],
      });
    }
  });
