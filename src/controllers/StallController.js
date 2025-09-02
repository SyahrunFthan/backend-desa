import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import Stall from "../models/Stall.js";
import Resident from "../models/Resident.js";
import StallCategory from "../models/StallCategory.js";

export const index = async (req, res) => {
  try {
    const {
      page = 1,
      page_size = 5,
      resident_id,
      category_id,
      name,
      phone_number,
      status,
    } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(resident_id && {
        [Op.or]: [
          { "$resident.resident_id$": { [Op.like]: `%${resident_id}%` } },
          { "$resident.fullname$": { [Op.liitemke]: `%${resident_id}%` } },
        ],
      }),
      ...(category_id && {
        "$category.name$": { [Op.like]: `%${category_id}%` },
      }),
      ...(name && { name: { [Op.like]: `%${name}%` } }),
      ...(phone_number && { phone_number: { [Op.like]: `%${phone_number}%` } }),
      ...(status && { status }),
    };

    const { count: total, rows: stalls } = await Stall.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Resident,
          as: "resident",
          foreignKey: "resident_id",
        },
        {
          model: StallCategory,
          as: "category",
          foreignKey: "category_id",
        },
      ],
    });

    return res.status(200).json({ total, stalls });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const allowedTypes = [".png", ".jpg", ".jpeg"];
    if (!allowedTypes.includes(ext.toLowerCase()))
      return res.status(422).json({ file: res.__("stall.file.type") });
    if (fileSize > 1024 * 1024 * 2)
      return res.status(422).json({ file: res.__("stall.file.size") });

    const filename = Date.now() + ext;
    const filepath = `${req.protocol}://${req.get(
      "host"
    )}/public/stalls/${filename}`;

    await Stall.create({
      ...req.body,
      image: filename,
      path_image: filepath,
    });

    await file.mv(`public/stalls/${filename}`);

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const stall = await Stall.findByPk(id);
    if (!stall)
      return res.status(404).json({ message: res.__("message.notFound") });

    let filename = stall.image;
    let filepath = stall.path_image;

    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".png", ".jpg", ".jpeg"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res.status(422).json({ file: res.__("stall.file.type") });
      if (fileSize > 1024 * 1024 * 2)
        return res.status(422).json({ file: res.__("stall.file.size") });
      if (stall.image !== null) {
        fs.unlinkSync(`public/stalls/${stall.image}`);
      }

      filename = Date.now() + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/stalls/${filename}`;

      await file.mv(`public/stalls/${filename}`);
    }

    await stall.update({
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
    const stall = await Stall.findByPk(id);
    if (!stall)
      return res.status(404).jerrorson({ message: res.__("message.notFound") });

    await stall.destroy();

    if (stall.image !== null) {
      fs.unlinkSync(`public/stalls/${stall.image}`);
    }

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
