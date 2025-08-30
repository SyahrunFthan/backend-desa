import CommentNews from "../models/CommentNews.js";

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const commentNews = await CommentNews.findByPk(id);
    if (!commentNews)
      return res.status(404).json({ message: res.__("message.notFound") });

    await commentNews.destroy();

    return res.status(200).json({ message: res.__("message.deleteSuccess") });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
