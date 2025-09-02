import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import StallCategory from "../models/StallCategory.js";

export const index = async (req, res) => {
  try {
    const { page = 1, page_size = 5, search } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(search && { name: { [Op.like]: `%${search}%` } }),
    };

    const { count: total, rows: stallCategories } =
      await StallCategory.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

    return res.status(200).json({ total, stallCategories });
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
      const filesize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".png", ".jpg", ".jpeg"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res
          .status(422)
          .json({ file: res.__("stallCategory.file.type") });
      if (filesize > 1024 * 1024 * 2)
        return res
          .status(422)
          .json({ file: res.__("stallCategory.file.size") });
      filename = Date.now() + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/stall-categories/${filename}`;
      await file.mv(`public/stall-categories/${filename}`);
    }

    await StallCategory.create({
      ...req.body,
      icon_file: filename,
      icon_path: filepath,
    });

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const stallCategory = await StallCategory.findByPk(id);
    if (!stallCategory)
      return res.status(404).json({ message: res.__("message.notFound") });

    let filename = stallCategory.icon_file;
    let filepath = stallCategory.icon_path;
    if (req.files && req.files.file) {
      const file = req.files.file;
      const filesize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".png", ".jpg", ".jpeg"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res
          .status(422)
          .json({ file: res.__("stallCategory.file.type") });
      if (filesize > 1024 * 1024 * 2)
        return res
          .status(422)
          .json({ file: res.__("stallCategory.file.size") });
      if (stallCategory.icon_file !== "activity.png") {
        fs.unlinkSync(`public/stall-categories/${stallCategory.icon_file}`);
      }

      filename = Date.now() + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/stall-categories/${filename}`;

      await file.mv(`public/stall-categories/${filename}`);
    }

    await stallCategory.update({
      ...req.body,
      icon_file: filename,
      icon_path: filepath,
    });

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const stallCategory = await StallCategory.findByPk(id);
    if (!stallCategory)
      return res.status(404).json({ message: res.__("message.notFound") });

    await stallCategory.destroy();

    if (stallCategory.icon_file !== "activity.png") {
      fs.unlinkSync(`public/stall-categories/${stallCategory.icon_file}`);
    }

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
