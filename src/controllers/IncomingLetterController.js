import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import IncomingLetter from "../models/IncomingLetter.js";

export const index = async (req, res) => {
  try {
    const {
      page = 1,
      page_size = 5,
      code,
      date_of_letter,
      date_of_receipt,
      sender,
      regarding,
      status_letter,
    } = req.query;

    const limit = Number(page_size);
    const current = Number(page);
    const offset = (current - 1) * limit;

    const where = {
      ...(code && { code: { [Op.like]: `%${code}%` } }),
      ...(sender && { sender: { [Op.like]: `%${sender}%` } }),
      ...(regarding && { regarding: { [Op.like]: `%${regarding}%` } }),
      ...(status_letter && { status_letter: status_letter }),
      ...(date_of_letter && { date_of_letter: date_of_letter }),
      ...(date_of_receipt && { date_of_receipt: date_of_receipt }),
    };

    const { count: total, rows: incoming_letters } =
      await IncomingLetter.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

    return res.status(200).json({ total, incoming_letters });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    const { summary } = req.body;

    let filename = null;
    let filepath = null;

    if (req.files && req.files.file) {
      const file = req.files.file;
      const filesize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".pdf"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res.status(422).json({ file: "incomingLetters.file.type" });
      if (filesize > 2000000)
        return res.status(422).json({ file: "incomingLetters.file.size" });

      filename = Date.now() + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/incoming-letters/${filename}`;

      await file.mv(`public/incoming-letters/${filename}`);
    }

    await IncomingLetter.create({
      ...req.body,
      letter_file: filename,
      letter_path: filepath,
      summary: summary !== "" ? summary : null,
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

    const incomingLetter = await IncomingLetter.findByPk(id);
    if (!incomingLetter)
      return res.status(404).json({ message: res.__("message.notFound") });

    let filename = incomingLetter.letter_file;
    let filepath = incomingLetter.letter_path;
    if (req.files && req.files.file) {
      const file = req.files.file;
      const filesize = file.data.length;
      const ext = path.extname(file.name);
      const allowedTypes = [".pdf"];
      if (!allowedTypes.includes(ext.toLowerCase()))
        return res.status(422).json({ file: "incomingLetters.file.type" });
      if (filesize > 2000000)
        return res.status(422).json({ file: "incomingLetters.file.size" });
      if (incomingLetter.letter_file !== null) {
        fs.unlinkSync(`public/incoming-letters/${incomingLetter.letter_file}`);
      }

      filename = Date.now() + ext;
      filepath = `${req.protocol}://${req.get(
        "host"
      )}/public/incoming-letters/${filename}`;
      await file.mv(`public/incoming-letters/${filename}`);
    }

    await incomingLetter.update({
      ...req.body,
      letter_file: filename,
      letter_path: filepath,
      summary: summary !== "" ? summary : null,
    });

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const incomingLetter = await IncomingLetter.findByPk(id);
    if (!incomingLetter)
      return res.status(404).json({ message: res.__("message.notFound") });
    if (incomingLetter.letter_file !== null) {
      fs.unlinkSync(`public/incoming-letters/${incomingLetter.letter_file}`);
    }

    await incomingLetter.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
