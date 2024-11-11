import { User } from "../db/mongodb/models/user.js";

export const extractUserInfo = async (req, res, next) => {
  const userData = req.headers["x-user-data"];
  if (!userData) {
    return res.status(401).json({ message: "User header is missing" });
  }

  try {
    const { email } = userData ? JSON.parse(userData) : null;
    const userInfo = await User.findOne({
      email,
    });

    req.user = userInfo;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Some error occurred in decoding user data" });
  }
};
