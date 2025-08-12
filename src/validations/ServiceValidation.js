import { z } from "zod";
import Service from "../models/Service.js";
import { Op } from "sequelize";

const serviceCreateSchema = z
  .object({
    name: z.string().nonempty("service.required.name"),
    type_service: z.string().nonempty("service.required.type_service"),
    status_service: z.string().nonempty("service.required.status_service"),
    file: z.custom(
      (file) => {
        if (!file) return false;
        return true;
      },
      {
        message: "service.required.file",
      }
    ),
  })
  .superRefine(async (data, ctx) => {
    const exists = await Service.findOne({
      where: {
        name: data.name,
        type_service: data.type_service,
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["name"],
        code: "custom",
        message: "service.unique.name",
      });
    }
  });

const serviceUpdateSchema = z
  .object({
    name: z.string().nonempty("service.required.name"),
    type_service: z.string().nonempty("service.required.type_service"),
    status_service: z.string().nonempty("service.required.status_service"),
    id: z.uuidv4(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await Service.findOne({
      where: {
        name: data.name,
        type_service: data.type_service,
        id: {
          [Op.ne]: data.id,
        },
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["name"],
        code: "custom",
        message: "service.unique.name",
      });
    }
  });

export { serviceCreateSchema, serviceUpdateSchema };
