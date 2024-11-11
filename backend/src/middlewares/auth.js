import jwt, { decode } from "jsonwebtoken";
import { User } from "../db/mongodb/models/user.js";

// Secret key for signing the JWT
const JWT_SECRET = process.env.JWT_SECRET || "very-secret-token";

// Function to generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "6h" }); // Token expires in 1 hour
};

// Middleware to verify token
export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from the header
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify the JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    // const storedToken = await User.findOne({ token });
    // console.log(storedToken);

    // if (!storedToken) {
    //   return res.status(401).json({ message: "Invalid token" });
    // }

    // // Check if the token has expired
    // if (new Date() > new Date(storedToken.expiresAt)) {
    //   return res.status(401).json({ message: "Token expired" });
    // }

    req.user = decoded; // Attach the userId to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
