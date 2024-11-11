import { User } from "../../db/mongodb/models/user.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../middlewares/auth.js";

export const LoginService = async (data) => {
  const { password, email } = data;
  // Validate User in database
  const user = await User.findOne({ email: data.email });
  if (!user) {
    return {
      status: 404,
      message: "User not found, Please signup!",
    };
  }

  // Compare the provided password with the stored hash
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return {
      status: 401,
      message: "Invalid password",
    };
  }

  // Generate a JWT for the user
  const token = generateToken({ email, name: user.name });

  // Update the token in MongoDB
  await User.updateOne(
    { email },
    {
      $set: {
        token: token,
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
      },
    }
  );

  return {
    status: 200,
    message: "Login successful",
    info: {
      email: user.email,
      name: user.name,
      token,
    },
  };
};

export const SignupService = async (data) => {
  // Validate User in database
  const { email, password, name } = data;

  // Check if user already exists
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    return {
      status: 404,
      message: "User already exists, Please login!",
    };
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  const token = generateToken({ email, name });

  // Add User
  await User.create({
    email,
    password: hashedPassword,
    name,
    token: token,
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
  });

  // Generate JWT token
  return {
    status: 201,
    message: "User Registered!",
    info: {
      email: data.email,
      name: data.name,
      token,
    },
  };
};

export const DashboardService = async (email) => {
  // Validate User in database
  const account = await User.findOne({ email }, { __v: 0 });
  // Generate JWT token
  return {
    status: 200,
    message: "Account Fetched!",
    info: account,
  };
};

export const ResetPasswordService = async (data) => {
  const { email, newPassword } = data;
  // Validate User in database
  const account = await User.findOne({ email });
  if (!account) {
    return {
      status: 404,
      message: "User not found, Please signup!",
    };
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the token in MongoDB
  await User.updateOne(
    { email },
    {
      $set: {
        password: hashedPassword,
      },
    }
  );
  return {
    status: 200,
    message: "Account Password Updated!",
  };
};
