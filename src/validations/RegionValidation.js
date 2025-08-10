import { z } from "zod";
import Region from "../models/Region.js";
import { Op } from "sequelize";

const regionCreateSchema = z
  .object({
    leader_id: z.string().nonempty("region.required.leader_id"),
    name: z.string().nonempty("region.required.name"),
    geo_json: z.string().nonempty("region.required.geo_json"),
    color: z.string().nonempty("region.required.color"),
    land_area: z.string().nonempty("region.required.land_area"),
  })
  .superRefine(async (data, ctx) => {
    const exists = await Region.findOne({
      where: {
        leader_id: data.leader_id,
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["leader_id"],
        code: "custom",
        message: "region.unique.leader_id",
      });
    }

    const existColors = await Region.findOne({
      where: {
        color: data.color,
      },
    });

    if (existColors) {
      ctx.addIssue({
        path: ["color"],
        code: "custom",
        message: "region.unique.color",
      });
    }

    if (data.geo_json === "") {
      ctx.addIssue({
        path: ["file"],
        code: "custom",
        message: "region.required.geo_json",
      });
    }
  });

const regionUpdateSchema = z
  .object({
    leader_id: z.string().nonempty("region.required.leader_id"),
    name: z.string().nonempty("region.required.name"),
    geo_json: z.string().nonempty("region.required.geo_json"),
    color: z.string().nonempty("region.required.color"),
    land_area: z.string().nonempty("region.required.land_area"),
    id: z.uuidv4(),
  })
  .superRefine(async (data, ctx) => {
    const exists = await Region.findOne({
      where: {
        leader_id: data.leader_id,
        id: {
          [Op.ne]: data.id,
        },
      },
    });

    if (exists) {
      ctx.addIssue({
        path: ["leader_id"],
        code: "custom",
        message: "region.unique.leader_id",
      });
    }

    const existColors = await Region.findOne({
      where: {
        color: data.color,
        id: {
          [Op.ne]: data.id,
        },
      },
    });

    if (existColors) {
      ctx.addIssue({
        path: ["color"],
        code: "custom",
        message: "region.unique.color",
      });
    }

    if (data.geo_json === "") {
      ctx.addIssue({
        path: ["file"],
        code: "custom",
        message: "region.required.geo_json",
      });
    }
  });

export { regionCreateSchema, regionUpdateSchema };
