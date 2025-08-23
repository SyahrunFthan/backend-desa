import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import Activity from "../models/Activity.js";

export const index = async (req, res) => {
  try {
    const { page = 1, page_size = 5, search } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(search && { name: { [Op.like]: `%${search}%` } }),
    };

    const { count: total, rows: activities } = await Activity.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ total, activities });
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
        return res.status(422).json({ file: res.__("activity.file.type") });
      if (fileSize > 1024 * 1024 * 2)
        return res.status(422).json({ file: res.__("activity.file.size") });

      filename = Date.now() + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/activities/${filename}`;

      await file.mv(`public/activities/${filename}`);
    }

    await Activity.create({
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
    const activity = await Activity.findByPk(id);
    if (!activity)
      return res.status(404).json({ message: res.__("message.notFound") });

    let filename = activity.image;
    let filepath = activity.path_image;
    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".png", ".jpg", ".jpeg"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res.status(422).json({ file: res.__("activity.file.type") });
      if (fileSize > 1024 * 1024 * 2)
        return res.status(422).json({ file: res.__("activity.file.size") });
      if (activity.image !== "activity.png") {
        fs.unlinkSync(`public/activities/${activity.image}`);
      }

      filename = Date.now() + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/activities/${filename}`;

      await file.mv(`public/activities/${filename}`);
    }

    await activity.update({
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
    const activity = await Activity.findByPk(id);
    if (!activity)
      return res.status(404).json({ message: res.__("message.notFound") });

    if (activity.image !== "activity.png") {
      fs.unlinkSync(`public/activities/${activity.image}`);
    }

    await activity.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
