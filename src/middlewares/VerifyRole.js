const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    const { role } = req;

    if (!role) {
      return res.status(403).json({ message: "Role tidak ditemukan!" });
    }

    if (!requiredRole.includes(role)) {
      return res.status(403).json({
        message: `Akses ditolak! Peran yang dibutuhkan: ${requiredRole.join(
          ", "
        )}`,
      });
    }

    next();
  };
};

export default verifyRole;
