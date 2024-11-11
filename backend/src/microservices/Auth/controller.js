import Joi from "joi";
import {
  DashboardService,
  LoginService,
  ResetPasswordService,
  SignupService,
} from "./service.js";

export const LoginController = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    await schema.validateAsync(req.body);
    // Make Service call
    const response = await LoginService(req.body);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

export const SignupController = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    await schema.validateAsync(req.body);
    // Make Service call
    const response = await SignupService(req.body);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

export const DashboardController = async (req, res, next) => {
  try {
    if (!req.email) {
      return res.status(500).json({ msg: "Some Error Occured!" });
    }
    // Make Service call
    return res.json(await DashboardService(req.email));
  } catch (error) {
    next(error);
  }
};

export const ResetPasswordController = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      newPassword: Joi.string().required(),
    });
    await schema.validateAsync(req.body);
    // Make Service call
    return res.json(await ResetPasswordService(req.body));
  } catch (error) {
    next(error);
  }
};
