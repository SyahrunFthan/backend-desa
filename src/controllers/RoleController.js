import Role from "../models/Role.js";

export const index = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.page_size) || 5;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * pageSize;

    const { rows: response, count: total } = await Role.findAndCountAll({
      offset: offset,
      limit: pageSize,
      order: [["name", "ASC"]],
    });

    return res.status(200).json({ response, total });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const store = async (req, res) => {
  try {
    await Role.create(req.body);

    return res.status(201).json({ message: res.__("message.createSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await Role.findByPk(id);
    if (!role)
      return res.status(404).json({ message: res.__("message.notFound") });

    await role.update(req.body);

    return res.status(200).json({ message: res.__("message.updateSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await Role.findByPk(id);
    if (!role)
      return res.status(404).json({ message: res.__("message.notFound") });

    await role.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
