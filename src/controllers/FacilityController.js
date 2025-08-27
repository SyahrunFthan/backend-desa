import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import Facility from "../models/Facility.js";
import Region from "../models/Region.js";
import { fi } from "zod/v4/locales";

export const index = async (req, res) => {
  try {
    const { page = 1, page_size = 5, search } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(search && { name: { [Op.like]: `%${search}%` } }),
    };

    const { count: total, rows: facilities } = await Facility.findAndCountAll({
      where,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    const regions = await Region.findAll({ attributes: ["id", "name"] });

    return res.status(200).json({ total, facilities, regions });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    let filename = "activity.png";
    let filepath = `${req.protocol}://${req.get("host")}/public/${filename}`;
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".png", ".jpg", ".jpeg"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res.status(422).json({ file: res.__("facility.file.type") });
      if (fileSize > 1024 * 1024 * 2)
        return res.status(422).json({ file: res.__("facility.file.size") });

      filename = Date.now() + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/facilities/${filename}`;
      file.mv(`public/facilities/${filename}`);
    }

    await Facility.create({
      ...req.body,
      image: filename,
      path_image: filepath,
    });

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findByPk(id);
    if (!facility)
      return res.status(404).json({ message: res.__("message.notFound") });

    let filename = facility.image;
    let filepath = facility.path_image;
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".png", ".jpg", ".jpeg"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res.status(422).json({ file: res.__("facility.file.type") });
      if (fileSize > 1024 * 1024 * 2)
        return res.status(422).json({ file: res.__("facility.file.size") });
      if (facility.image !== "activity.png") {
        fs.unlinkSync(`public/facilities/${facility.image}`);
      }

      filename = Date.now() + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/facilities/${filename}`;
      file.mv(`public/facilities/${filename}`);
    }

    await facility.update({
      ...req.body,
      image: filename,
      path_image: filepath,
    });

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findByPk(id);
    if (!facility)
      return res.status(404).json({ message: res.__("message.notFound") });

    if (facility.image !== "activity.png") {
      fs.unlinkSync(`public/facilities/${facility.image}`);
    }

    await facility.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: res.__("message.error") });
  }
};
