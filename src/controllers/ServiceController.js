import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import Service from "../models/Service.js";

export const index = async (req, res) => {
  try {
    const {
      page = 1,
      page_size = 5,
      name,
      type_service,
      status_service,
    } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(name && { name: { [Op.like]: `%${name}%` } }),
      ...(type_service && { type_service }),
      ...(status_service && { status_service }),
    };

    const { count: total, rows: services } = await Service.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ total, services });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    let filename = null;
    let filepath = null;
    if (req.files && req.files.file) {
      const file = req.files.file;
      const filesize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".pdf", ".docx"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res.status(422).json({ file: res.__("service.file.type") });
      if (filesize > 1024 * 1024 * 2)
        return res.status(422).json({ file: res.__("service.file.size") });

      filename = Date.now() + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/services/${filename}`;

      await file.mv(`public/services/${filename}`);
    }

    await Service.create({
      ...req.body,
      template_file: filename,
      template_path: filepath,
    });

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service)
      return res.status(404).json({ message: res.__("message.notFound") });

    let filename = service.template_file;
    let filepath = service.template_path;
    if (req.files && req.files.file) {
      const file = req.files.file;
      const filesize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".pdf", ".docx"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res.status(422).json({ file: res.__("service.file.type") });
      if (filesize > 1024 * 1024 * 2)
        return res.status(422).json({ file: res.__("service.file.size") });
      if (service.template_file !== null) {
        fs.unlinkSync(`public/services/${service.template_file}`);
      }

      filename = Date.now() + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/services/${filename}`;

      await file.mv(`public/services/${filename}`);
    }

    await service.update({
      ...req.body,
      template_file: filename,
      template_path: filepath,
    });

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service)
      return res.status(404).json({ message: res.__("message.notFound") });
    if (service.template_file !== null) {
      fs.unlinkSync(`public/services/${service.template_file}`);
    }

    await service.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
