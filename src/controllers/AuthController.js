import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Resident from "../models/Resident.js";
import Role from "../models/Role.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    include: [
      {
        model: Resident,
        as: "resident",
        foreignKey: "resident_id",
      },
      {
        model: Role,
        as: "role",
        foreignKey: "role_id",
      },
    ],
    where: {
      username: username,
    },
  });

  if (!user)
    return res
      .status(400)
      .json({ username: res.__("validation.invalid", { field: "Username" }) });

  if (user.role.key === "user")
    return res.status(409).json({ message: "Anda bukan admin" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res
      .status(400)
      .json({ password: res.__("validation.invalid", { field: "Password" }) });

  try {
    const userId = user.id;
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN, {
      expiresIn: "5m",
    });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN, {
      expiresIn: "1d",
    });

    await user.update({ token: refreshToken });

    res.cookie("token", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.token;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const user = await User.findOne({
      include: [
        {
          model: Resident,
          as: "resident",
          foreignKey: "resident_id",
        },
        {
          model: Role,
          as: "role",
          foreignKey: "role_id",
        },
      ],
      where: {
        token: refreshToken,
      },
    });

    if (!user) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) return res.sendStatus(403);

      const userId = decoded.userId;

      const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN, {
        expiresIn: "5m",
      });

      return res.status(200).json({ accessToken });
    });
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};

export const logout = async (req, res) => {
  const { userId } = req;

  try {
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({ message: res.__("validation.notFound") });

    await user.update({ token: null });

    res.clearCookie("token");

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ message: res.__("message.error") });
  }
};
