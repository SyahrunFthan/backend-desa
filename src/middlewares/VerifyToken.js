import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader)
      return res.status(401).json({ message: "Token not found" });

    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token not found" });

    jwt.verify(token, process.env.ACCESS_TOKEN, async (err, decoded) => {
      if (err) return res.sendStatus(403);

      req.userId = decoded.userId;
      req.residentId = decoded.residentId;

      const user = await User.findOne({
        where: {
          id: decoded.userId,
        },
        include: [
          {
            model: Role,
            as: "role",
            foreignKey: "role_id",
          },
        ],
      });

      req.role = user.role.key;
      req.roleId = user.role.id;

      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default verifyToken;
