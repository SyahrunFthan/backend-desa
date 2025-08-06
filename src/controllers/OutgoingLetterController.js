import { Op } from "sequelize";
import OutgoingLetter from "../models/OutgoingLetter.js";
import path from "path";
import fs from "fs";

export const index = async (req, res) => {
  try {
    const {
      page = 1,
      page_size = 5,
      code,
      regarding,
      date_of_letter,
      objective,
      status_letter,
    } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(code && { code: { [Op.like]: `%${code}%` } }),
      ...(regarding && { regarding: { [Op.like]: `%${regarding}%` } }),
      ...(date_of_letter && { date_of_letter: date_of_letter }),
      ...(objective && { objective: { [Op.like]: `%${objective}%` } }),
      ...(status_letter && { status_letter: status_letter }),
    };

    const { count: total, rows } = await OutgoingLetter.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ total, rows });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    let filaneme;
    let filepath;
    if (req.files && req.files.file) {
      const file = req.files.file;
      const filesize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".pdf"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res
          .status(422)
          .json({ file: res.__("outgoingLetters.file.type") });
      if (filesize > 1024 * 1024 * 2)
        return res
          .status(422)
          .json({ file: res.__("outgoingLetters.file.size") });

      filaneme = Date.now() + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/outgoing-letters/${filaneme}`;

      await file.mv(`public/outgoing-letters/${filaneme}`);
    }

    await OutgoingLetter.create({
      ...req.body,
      letter_file: filaneme,
      letter_path: filepath,
    });

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { summary } = req.body;
    const outgoingLetter = await OutgoingLetter.findByPk(id);
    if (!outgoingLetter)
      return res.status(404).json({ message: res.__("message.notFound") });

    let filename = outgoingLetter.letter_file;
    let filepath = outgoingLetter.letter_path;
    if (req.files && req.files.file) {
      const file = req.files.file;
      const filesize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".pdf"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res
          .status(422)
          .json({ file: res.__("outgoingLetters.file.type") });
      if (filesize > 1024 * 1024 * 2)
        return res
          .status(422)
          .json({ file: res.__("outgoingLetters.file.size") });
      if (outgoingLetter.letter_file !== null) {
        const filePath = `public/outgoing-letters/${outgoingLetter.letter_file}`;
        fs.unlinkSync(filePath);
      }

      filename = Date.now() + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/outgoing-letters/${filename}`;

      await file.mv(`public/outgoing-letters/${filename}`);
    }

    await outgoingLetter.update({
      ...req.body,
      summary: summary !== "" ? summary : null,
      letter_file: filename,
      letter_path: filepath,
    });

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const outgoingLetter = await OutgoingLetter.findByPk(id);
    if (!outgoingLetter)
      return res.status(404).json({ message: res.__("message.notFound") });

    if (outgoingLetter.letter_file !== null) {
      const filePath = `public/outgoing-letters/${outgoingLetter.letter_file}`;
      fs.unlinkSync(filePath);
    }

    await outgoingLetter.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
