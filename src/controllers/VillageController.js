import Village from "../models/Village.js";
import path from "path";
import fs from "fs";

export const index = async (req, res) => {
  try {
    const response = await Village.findAll();

    return res.status(200).json({ result: response[0] });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    const { name } = req.body;
    if (name === "")
      return res.status(400).json({ name: res.__("village.required.name") });

    await Village.create(req.body);

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const updateLogo = async (req, res) => {
  try {
    const { id } = req.params;
    const village = await Village.findByPk(id);
    if (!village)
      return res.status(404).json({ message: res.__("message.notFound") });
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const allowdTypes = [".png", ".jpg", ".jpeg"];
    if (!allowdTypes.includes(ext.toLowerCase()))
      return res.status(422).json({ file: res.__("village.file.type") });
    if (fileSize > 1024 * 1024 * 3)
      return res.status(422).json({ file: res.__("village.file.size") });
    if (village.logo !== null) {
      fs.unlinkSync(`public/villages/${village.logo}`);
    }

    const filename = Date.now() + ext;
    const filepath = `${req.protocol}://${req.get(
      "host"
    )}/public/villages/${filename}`;

    await file.mv(`public/villages/${filename}`);

    await village.update({
      logo: filename,
      path_logo: filepath,
    });

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const village = await Village.findByPk(id);
    if (!village)
      return res.status(404).json({ message: res.__("message.notFound") });
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const allowdTypes = [".png", ".jpg", ".jpeg"];
    if (!allowdTypes.includes(ext.toLowerCase()))
      return res.status(422).json({ file: res.__("village.file.type") });
    if (fileSize > 1024 * 1024 * 3)
      return res.status(422).json({ file: res.__("village.file.size") });
    if (village.image !== null) {
      fs.unlinkSync(`public/villages/${village.image}`);
    }

    const filename = Date.now() + ext;
    const filepath = `${req.protocol}://${req.get(
      "host"
    )}/public/villages/${filename}`;

    await file.mv(`public/villages/${filename}`);

    await village.update({
      image: filename,
      path_image: filepath,
    });

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const updateVissionAndMission = async (req, res) => {
  try {
    const { id } = req.params;
    const village = await Village.findByPk(id);
    if (!village)
      return res.status(404).json({ message: res.__("message.notFound") });

    await village.update(req.body);

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const updateAboutAndHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const village = await Village.findByPk(id);
    if (!village)
      return res.status(404).json({ message: res.__("message.notFound") });

    await village.update(req.body);

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
